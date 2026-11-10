/**
 * Komposisi bidang warna bersudut, terinspirasi moodboard: dinding bata,
 * langit biru, dan batu pasir. Murni dekorasi.
 */
export default function BidangWarna() {
  return (
    <div aria-hidden className="relative mx-auto aspect-[5/4] w-full max-w-md md:max-w-none">
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-langit-100">
        {/* langit */}
        <div className="absolute inset-0 bg-gradient-to-b from-kobalt to-langit" />
        {/* dinding bata miring */}
        <div className="absolute inset-0 bg-bata" style={{ clipPath: "polygon(22% 8%, 78% 70%, 22% 70%)" }} />
        {/* tiang batu pasir */}
        <div className="absolute inset-0 bg-pasir" style={{ clipPath: "polygon(0 0, 24% 0, 24% 64%, 0 70%)" }} />
        {/* dinding biru bergerigi di depan */}
        <div
          className="absolute inset-0 bg-kobalt"
          style={{ clipPath: "polygon(0 70%, 30% 58%, 48% 72%, 66% 60%, 100% 66%, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 bg-navy"
          style={{ clipPath: "polygon(55% 100%, 100% 78%, 100% 100%)" }}
        />
      </div>
      {/* tempelan kecil, kesan ceria */}
      <span className="absolute -left-3 top-8 h-10 w-10 rounded-full bg-bata shadow-lg shadow-bata/30 sm:-left-5 sm:h-14 sm:w-14" />
      <span className="absolute -bottom-4 right-10 h-8 w-24 rounded-full bg-pasir shadow-md" />
    </div>
  );
}
