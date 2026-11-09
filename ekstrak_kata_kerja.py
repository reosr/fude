import json
import os

ROOT_DIR = os.path.dirname(__file__)
KOSAKATA_PATH = os.path.join(ROOT_DIR, 'data', 'kosakata.json')
OUTPUT_PATH = os.path.join(ROOT_DIR, 'data', 'kamus-kerja.json')

# Kamus perubahan dari Masu ke Kamus
godan_map_kana = {'い':'う', 'き':'く', 'ぎ':'ぐ', 'し':'す', 'ち':'つ', 'に':'ぬ', 'び':'ぶ', 'み':'む', 'り':'る'}

def convert_to_dict(kana, romaji, kanji=""):
    if not kana.endswith("ます"): return None
    
    k_stem = kana[:-2]
    r_stem = romaji[:-4] if romaji.endswith("masu") else romaji
    
    # 1. Irregular (Kelompok III)
    if kana == "します" or romaji == "shimasu":
        return {"kana": "する", "romaji": "suru", "type": "Irregular", "kanji": "する"}
    if kana == "きます" or romaji == "kimasu" or "来" in kanji:
        return {"kana": "くる", "romaji": "kuru", "type": "Irregular", "kanji": "来る"}
    
    # 2. Ichidan (Kelompok II) - Ciri: huruf sebelum "masu" berbunyi 'e' atau ada di list khusus
    ichidan_exceptions = ["mi", "oki", "ori", "kari", "deki", "ni", "mise", "kikoe", "mie", "ki"] # ki = memakai (着ます)
    if r_stem[-1] == 'e' or r_stem in ichidan_exceptions:
        dict_kana = k_stem + "る"
        dict_romaji = r_stem + "ru"
        dict_kanji = kanji[:-2] + "る" if kanji and kanji.endswith("ます") else dict_kana
        return {"kana": dict_kana, "romaji": dict_romaji, "type": "Ichidan", "kanji": dict_kanji}

    # 3. Godan (Kelompok I) - Ciri: huruf terakhir sebelum "masu" adalah baris 'i'
    last_char = k_stem[-1]
    if last_char in godan_map_kana:
        dict_char = godan_map_kana[last_char]
        dict_kana = k_stem[:-1] + dict_char
        
        # Ubah Romaji balik ke bentuk kamus
        dict_romaji = ""
        if r_stem.endswith("i"): dict_romaji = r_stem[:-1] + "u"
        elif r_stem.endswith("ki"): dict_romaji = r_stem[:-2] + "ku"
        elif r_stem.endswith("gi"): dict_romaji = r_stem[:-2] + "gu"
        elif r_stem.endswith("shi"): dict_romaji = r_stem[:-3] + "su"
        elif r_stem.endswith("chi"): dict_romaji = r_stem[:-3] + "tsu"
        elif r_stem.endswith("ni"): dict_romaji = r_stem[:-2] + "nu"
        elif r_stem.endswith("bi"): dict_romaji = r_stem[:-2] + "bu"
        elif r_stem.endswith("mi"): dict_romaji = r_stem[:-2] + "mu"
        elif r_stem.endswith("ri"): dict_romaji = r_stem[:-2] + "ru"
        else: dict_romaji = r_stem + "u"
        
        dict_kanji = kanji[:-2] + dict_char if kanji and kanji.endswith("ます") else dict_kana
        return {"kana": dict_kana, "romaji": dict_romaji, "type": "Godan", "kanji": dict_kanji}
        
    return None

def extract_verbs():
    if not os.path.exists(KOSAKATA_PATH):
        print("File kosakata.json tidak ditemukan!")
        return

    with open(KOSAKATA_PATH, 'r', encoding='utf-8') as f:
        kosakata_data = json.load(f)

    unique_verbs = {}

    for bab in kosakata_data:
        for v in bab.get('vocab', []):
            kana = v.get('kana', '').strip()
            kanji = v.get('kanji', '').strip()
            romaji = v.get('romaji', '').lower().strip()
            meaning = v.get('meaning', '').strip()

            # Cuma proses yang berakhiran "ます" (Kata kerja sopan)
            if kana.endswith('ます') and meaning:
                key = kanji if kanji else kana
                if key not in unique_verbs:
                    dict_form = convert_to_dict(kana, romaji, kanji)
                    if dict_form:
                        unique_verbs[key] = {
                            "kanji": dict_form["kanji"],
                            "kana": dict_form["kana"],
                            "romaji": dict_form["romaji"],
                            "meaning": meaning,
                            "type": dict_form["type"]
                        }

    result = list(unique_verbs.values())
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Sukses! Berhasil mengekstrak dan mengubah {len(result)} kata kerja ke Bentuk Kamus.")

if __name__ == "__main__":
    extract_verbs()