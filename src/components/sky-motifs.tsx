import s from './sky-motifs.module.css';

/** Decorative only; all labels and controls stay in the surrounding content. */
export function SkyMotifs() {
  return <div className={s.sky} aria-hidden="true">
    <span className={`${s.star} ${s.first}`} />
    <span className={`${s.star} ${s.second}`} />
    <span className={`${s.star} ${s.third}`} />
    <span className={`${s.cloud} ${s.left}`} />
    <span className={`${s.cloud} ${s.right}`} />
  </div>;
}
