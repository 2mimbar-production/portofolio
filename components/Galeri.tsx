import Muncul from "./Muncul";

// Posisi foto di layar lebar: berserakan mengelilingi judul "Galeri".
const POSISI = [
  "md:left-[8%] md:top-[18%] md:w-[24%]",
  "md:right-[10%] md:top-[6%] md:w-[26%]",
  "md:left-[2%] md:top-[2%] md:w-[11%]",
  "md:left-[38%] md:bottom-[4%] md:w-[20%]",
  "md:right-[0%] md:top-[52%] md:w-[13%]",
  "md:left-[6%] md:bottom-[0%] md:w-[13%]",
  "md:right-[22%] md:bottom-[8%] md:w-[16%]",
];

export default function Galeri({ foto, judul }: { foto: string[]; judul: string }) {
  if (foto.length < 2) return null;
  return (
    <section className="relative">
      <h2 className="mb-6 text-center font-display text-4xl text-navy md:pointer-events-none md:absolute md:inset-0 md:mb-0 md:flex md:items-center md:justify-center md:text-6xl">
        Galeri
      </h2>
      <div className="grid grid-cols-2 gap-3 md:relative md:block md:h-[80vh] md:min-h-[560px]">
        {foto.map((src, i) => (
          <Muncul
            key={src}
            jeda={i * 90}
            className={`${i % 2 ? "mt-8" : ""} md:absolute md:mt-0 ${POSISI[i % POSISI.length]}`}
          >
            <img
              src={src}
              alt={`${judul}, foto ${i + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl shadow-navy/20 transition duration-500 hover:scale-105"
            />
          </Muncul>
        ))}
      </div>
    </section>
  );
}
