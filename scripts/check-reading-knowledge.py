#!/usr/bin/env python3
"""Validate the research pack's local structure; never claims predictive validity."""
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "docs" / "reading-knowledge"
PRODUCTS = {"basic", "love", "career", "money", "year", "decade", "compatibility"}
errors = []


def require(condition, message):
    if not condition:
        errors.append(message)


def read(name):
    try:
        return json.loads((PACK / name).read_text())
    except (OSError, ValueError) as exc:
        errors.append(f"{name}: {exc}")
        return {}


def index(rows, key, label):
    result = {}
    for row in rows:
        value = row.get(key)
        require(isinstance(value, str) and bool(value), f"{label}: missing {key}")
        require(value not in result, f"{label}: duplicate {value}")
        result[value] = row
    return result


sources_doc = read("sources.json")
rules_doc = read("rules.json")
tasks_doc = read("tasks.json")
cases_doc = read("cases.json")
features_doc = read("features.json")
sources = index(sources_doc.get("sources", []), "id", "source")
rules = index(rules_doc.get("rules", []), "id", "rule")
tasks = index(tasks_doc.get("tasks", []), "productId", "task")
cases = index(cases_doc.get("cases", []), "id", "case")
features = features_doc.get("features", {})
require(bool(sources) and bool(rules) and bool(cases) and bool(features), "pack must not be empty")
require(set(tasks) == PRODUCTS, "tasks must cover exactly the seven product IDs")
require(len({doc.get("version") for doc in (sources_doc, rules_doc, tasks_doc, cases_doc, features_doc)}) == 1,
        "pack version mismatch")
for source_id, source in sources.items():
    for key in ("work", "author", "chapter", "url", "checkedAt", "kind", "access", "edition",
                "sourceCredibility", "predictiveValidity", "reuseConditions", "permittedUse"):
        require(isinstance(source.get(key), str) and bool(source[key]), f"{source_id}: missing {key}")
    url = urlparse(source.get("url", ""))
    require(url.scheme == "https" and bool(url.netloc), f"{source_id}: invalid source URL")
    require(source.get("checkedAt") == "2026-10-28", f"{source_id}: unexpected check date")

for rule_id, rule in rules.items():
    for key in ("version", "title", "school", "status", "basis", "advice", "missingPolicy"):
        require(isinstance(rule.get(key), str) and bool(rule[key]), f"{rule_id}: missing {key}")
    for key in ("domains", "requiredFeatures", "conditions", "exceptions", "allowedInterpretation", "forbiddenClaims"):
        require(isinstance(rule.get(key), list) and bool(rule[key]) and
                all(isinstance(item, str) and bool(item) for item in rule[key]), f"{rule_id}: invalid {key}")
    require(rule.get("status") in rules_doc.get("statusDefinitions", {}), f"{rule_id}: unknown status")
    require(set(rule.get("domains", [])) <= PRODUCTS, f"{rule_id}: unknown domain")
    require(set(rule.get("requiredFeatures", [])) <= set(features), f"{rule_id}: unknown feature")
    require(isinstance(rule.get("sourceIds"), list), f"{rule_id}: sourceIds must be array")
    require(set(rule.get("sourceIds", [])) <= set(sources), f"{rule_id}: dangling source")
    if rule.get("status") == "conditional-tradition":
        require(bool(rule.get("sourceIds")), f"{rule_id}: traditional rule needs provenance")
        require(all(sources[sid]["kind"] != "modern-author-catalog" for sid in rule.get("sourceIds", []) if sid in sources),
                f"{rule_id}: a catalog is not evidence for book contents")
    require(rule.get("runtimeEnabled") is False, f"{rule_id}: research rules must not be runtime-enabled")
    require(isinstance(rule.get("requiresBirthTime"), bool), f"{rule_id}: missing time requirement")

for product_id, task in tasks.items():
    require(bool(task.get("sections")), f"{product_id}: sections missing")
    require(len(task.get("steps", [])) == 5, f"{product_id}: expected five analysis steps")
    require(set(task.get("requiredFeatures", [])) <= set(features), f"{product_id}: unknown required feature")
    require(set(task.get("optionalFeatures", [])) <= set(features), f"{product_id}: unknown optional feature")
    require(set(task.get("ruleCandidates", [])) <= set(rules), f"{product_id}: dangling rule")
    for rule_id in task.get("ruleCandidates", []):
        if rule_id in rules:
            require(product_id in rules[rule_id]["domains"], f"{product_id}: mismatched rule domain {rule_id}")
    require(bool(task.get("missingPolicy")) and bool(task.get("contextPolicy")), f"{product_id}: policy missing")

for case_id, case in cases.items():
    require(case.get("productId") in PRODUCTS, f"{case_id}: unknown product")
    require(isinstance(case.get("inputFeatures"), dict) and bool(case["inputFeatures"]), f"{case_id}: features missing")
    require(bool(case.get("expectedLimitations")) and bool(case.get("forbiddenOutputs")), f"{case_id}: expected limits missing")
    yes, no = set(case.get("expectedRuleIds", [])), set(case.get("excludedRuleIds", []))
    require(not yes & no, f"{case_id}: expected/excluded rules overlap")
    require((yes | no) <= set(rules), f"{case_id}: dangling rule")
    require(all(rules[rid]["status"] != "quarantined" for rid in yes if rid in rules),
            f"{case_id}: quarantined rule selected as explanatory evidence")
    require(case.get("isPredictionAccuracyTest") is False, f"{case_id}: must not claim predictive validation")
    require(case.get("fixtureKind") == "synthetic-research-case", f"{case_id}: must stay separate from app fixtures")
require({"CASE-COUNT-NOT-STRENGTH", "CASE-GANYEO-CONFLICT", "CASE-GANYEO-POLARITY",
         "CASE-UNKNOWN-TIME", "CASE-NO-DECADE-POLICY", "CASE-YEAR-MONTH-MISSING",
         "CASE-COMPAT-ONE-UNKNOWN"} <= set(cases), "required counterexamples missing")

if errors:
    print("\n".join(f"ERROR: {message}" for message in errors), file=sys.stderr)
    sys.exit(1)
print(f"PASS: {len(sources)} sources, {len(rules)} rules, {len(tasks)} products, {len(cases)} synthetic cases")
print("Checked local structure and references only; not source authenticity, semantics, calculation or prediction accuracy.")
