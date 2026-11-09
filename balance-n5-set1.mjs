import fs from "node:fs";

const filePath = process.argv[2];

if (!filePath) {
  throw new Error(
    "Masukkan lokasi file JSON sebagai argumen."
  );
}

const data = JSON.parse(
  fs.readFileSync(filePath, "utf8")
);

const n5 = data.find(item => item.level === "N5");
const set = n5?.sets?.find(
  item => item.id === "n5-set-1"
);

if (!set) {
  throw new Error("N5 Set 1 tidak ditemukan.");
}

// Posisi: 0 = A, 1 = B, 2 = C, 3 = D.
const distribution = {
  vocab: [
    2, 0, 3, 1, 1, 3, 0, 2, 3, 1,
    2, 0, 0, 2, 1, 3, 1, 0, 3, 2
  ],

  grammar: [
    1, 3, 0, 2, 2, 0, 3, 1, 3, 2,
    1, 0, 0, 1, 2, 3, 1, 3, 2, 0,
    2, 1, 0, 3, 3, 0, 1, 2, 0, 2,
    3, 1, 1, 0, 2, 3, 2, 3, 0, 1, 0
  ],

  reading: [
    2, 0, 3, 1, 1, 3,
    0, 2, 3, 1, 2, 0
  ],

  listening: [
    1, 3, 0, 2, 2, 0,
    3, 1, 3, 2, 1, 0
  ]
};

// Periksa seluruh data sebelum mengubahnya.
for (const [section, positions] of Object.entries(distribution)) {
  const questions = set.sections[section];

  if (!Array.isArray(questions)) {
    throw new Error(`Bagian ${section} tidak ditemukan.`);
  }

  if (questions.length !== positions.length) {
    throw new Error(
      `${section}: jumlah soal tidak sesuai.`
    );
  }

  questions.forEach((question, index) => {
    if (
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      !Number.isInteger(question.answer) ||
      question.answer < 0 ||
      question.answer > 3
    ) {
      throw new Error(
        `Data tidak valid: ${section}, soal ${index + 1}`
      );
    }
  });
}

// Pindahkan jawaban benar tanpa mengubah isi pilihan.
for (const [section, positions] of Object.entries(distribution)) {
  const questions = set.sections[section];

  questions.forEach((question, index) => {
    const correctAnswer = question.options.splice(
      question.answer,
      1
    )[0];

    const newPosition = positions[index];

    question.options.splice(
      newPosition,
      0,
      correctAnswer
    );

    question.answer = newPosition;
  });
}

fs.writeFileSync(
  filePath,
  JSON.stringify(data, null, 2) + "\n",
  "utf8"
);

console.log("Berhasil! Distribusi jawaban N5 Set 1 sudah diperbaiki.");