import json
import os

# ==========================================
# DAFTAR KATA KERJA N5-N4 (Lo bisa tambahin sendiri di sini nanti)
# ==========================================
verbs = [
  { "kanji": "書く", "kana": "かく", "romaji": "kaku", "meaning": "menulis", "type": "Godan" },
  { "kanji": "聞く", "kana": "きく", "romaji": "kiku", "meaning": "mendengar", "type": "Godan" },
  { "kanji": "行く", "kana": "いく", "romaji": "iku", "meaning": "pergi", "type": "Godan" },
  { "kanji": "歩く", "kana": "あるく", "romaji": "aruku", "meaning": "berjalan", "type": "Godan" },
  { "kanji": "働く", "kana": "はたらく", "romaji": "hataraku", "meaning": "bekerja", "type": "Godan" },
  { "kanji": "泳ぐ", "kana": "およぐ", "romaji": "oyogu", "meaning": "berenang", "type": "Godan" },
  { "kanji": "急ぐ", "kana": "いそぐ", "romaji": "isogu", "meaning": "bergegas", "type": "Godan" },
  { "kanji": "話す", "kana": "はなす", "romaji": "hanasu", "meaning": "berbicara", "type": "Godan" },
  { "kanji": "貸す", "kana": "かす", "romaji": "kasu", "meaning": "meminjamkan", "type": "Godan" },
  { "kanji": "待つ", "kana": "まつ", "romaji": "matsu", "meaning": "menunggu", "type": "Godan" },
  { "kanji": "持つ", "kana": "もつ", "romaji": "motsu", "meaning": "membawa", "type": "Godan" },
  { "kanji": "死ぬ", "kana": "しぬ", "romaji": "shinu", "meaning": "mati", "type": "Godan" },
  { "kanji": "遊ぶ", "kana": "あそぶ", "romaji": "asobu", "meaning": "bermain", "type": "Godan" },
  { "kanji": "呼ぶ", "kana": "よぶ", "romaji": "yobu", "meaning": "memanggil", "type": "Godan" },
  { "kanji": "読む", "kana": "よむ", "romaji": "yomu", "meaning": "membaca", "type": "Godan" },
  { "kanji": "飲む", "kana": "のむ", "romaji": "nomu", "meaning": "minum", "type": "Godan" },
  { "kanji": "休む", "kana": "やすむ", "romaji": "yasumu", "meaning": "beristirahat", "type": "Godan" },
  { "kanji": "帰る", "kana": "かえる", "romaji": "kaeru", "meaning": "pulang", "type": "Godan" },
  { "kanji": "入る", "kana": "はいる", "romaji": "hairu", "meaning": "masuk", "type": "Godan" },
  { "kanji": "買う", "kana": "かう", "romaji": "kau", "meaning": "membeli", "type": "Godan" },
  { "kanji": "会う", "kana": "あう", "romaji": "au", "meaning": "bertemu", "type": "Godan" },
  { "kanji": "洗う", "kana": "あらう", "romaji": "arau", "meaning": "mencuci", "type": "Godan" },
  { "kanji": "食べる", "kana": "たべる", "romaji": "taberu", "meaning": "makan", "type": "Ichidan" },
  { "kanji": "見る", "kana": "みる", "romaji": "miru", "meaning": "melihat", "type": "Ichidan" },
  { "kanji": "起きる", "kana": "おきる", "romaji": "okiru", "meaning": "bangun", "type": "Ichidan" },
  { "kanji": "寝る", "kana": "ねる", "romaji": "neru", "meaning": "tidur", "type": "Ichidan" },
  { "kanji": "着る", "kana": "きる", "romaji": "kiru", "meaning": "memakai", "type": "Ichidan" },
  { "kanji": "教える", "kana": "おしえる", "romaji": "oshieru", "meaning": "mengajar", "type": "Ichidan" },
  { "kanji": "覚える", "kana": "おぼえる", "romaji": "oboeru", "meaning": "mengingat", "type": "Ichidan" },
  { "kanji": "忘れる", "kana": "わすれる", "romaji": "wasureru", "meaning": "lupa", "type": "Ichidan" },
  { "kanji": "開ける", "kana": "あける", "romaji": "akeru", "meaning": "membuka", "type": "Ichidan" },
  { "kanji": "閉める", "kana": "しめる", "romaji": "shimeru", "meaning": "menutup", "type": "Ichidan" },
  { "kanji": "借りる", "kana": "かりる", "romaji": "kariru", "meaning": "meminjam", "type": "Ichidan" },
  { "kanji": "出かける", "kana": "でかける", "romaji": "dekakeru", "meaning": "keluar", "type": "Ichidan" },
  { "kanji": "する", "kana": "する", "romaji": "suru", "meaning": "melakukan", "type": "Irregular" },
  { "kanji": "来る", "kana": "くる", "romaji": "kuru", "meaning": "datang", "type": "Irregular" }
]

godan_endings = {
  'う': { 'a': 'わ', 'i': 'い', 'e': 'え', 'o': 'お', 'te': 'って', 'ta': 'った' },
  'く': { 'a': 'か', 'i': 'き', 'e': 'け', 'o': 'こ', 'te': 'いて', 'ta': 'いた' },
  'ぐ': { 'a': 'が', 'i': 'ぎ', 'e': 'げ', 'o': 'ご', 'te': 'いで', 'ta': 'いだ' },
  'す': { 'a': 'さ', 'i': 'し', 'e': 'せ', 'o': 'そ', 'te': 'して', 'ta': 'した' },
  'つ': { 'a': 'た', 'i': 'ち', 'e': 'て', 'o': 'と', 'te': 'って', 'ta': 'った' },
  'ぬ': { 'a': 'な', 'i': 'に', 'e': 'ね', 'o': 'の', 'te': 'んで', 'ta': 'んだ' },
  'ぶ': { 'a': 'ば', 'i': 'び', 'e': 'べ', 'o': 'ぼ', 'te': 'んで', 'ta': 'んだ' },
  'む': { 'a': 'ま', 'i': 'み', 'e': 'め', 'o': 'も', 'te': 'んで', 'ta': 'んだ' },
  'る': { 'a': 'ら', 'i': 'り', 'e': 'れ', 'o': 'ろ', 'te': 'って', 'ta': 'った' }
}

def conjugate(verb):
    kana = verb['kana']
    v_type = verb['type']
    
    if v_type == "Godan":
        last_char = kana[-1]
        base = kana[:-1]
        end = godan_endings[last_char]
        
        masu = base + end['i'] + "ます"
        te = base + end['te']
        ta = base + end['ta']
        nai = base + end['a'] + "ない"
        potential = base + end['e'] + "る"
        volitional = base + end['o'] + "う"
        conditional = base + end['e'] + "ば"
        imperative = base + end['e']
        passive = base + end['a'] + "れる"
        causative = base + end['a'] + "せる"
        
        if kana == "いく":
            te = "いって"
            ta = "いった"
            
    elif v_type == "Ichidan":
        stem = kana[:-1]
        masu = stem + "ます"
        te = stem + "て"
        ta = stem + "た"
        nai = stem + "ない"
        potential = stem + "られる"
        volitional = stem + "よう"
        conditional = stem + "れば"
        imperative = stem + "ろ"
        passive = stem + "られる"
        causative = stem + "させる"
        
    elif v_type == "Irregular":
        if kana == "する":
            masu, te, ta, nai, potential, volitional, conditional, imperative, passive, causative = "します", "して", "した", "しない", "できる", "しよう", "すれば", "しろ", "される", "させる"
        elif kana == "くる":
            masu, te, ta, nai, potential, volitional, conditional, imperative, passive, causative = "きます", "きて", "きた", "こない", "こられる", "こよう", "くれば", "こい", "こられる", "こさせる"

    def make_ruby(kana_form):
        kanji = verb['kanji']
        if not kanji or kanji == kana:
            return kana_form
        kanji_stem = kanji[:-1]
        kana_stem = kana[:-1]
        if kana_form.startswith(kana_stem):
            return f"<ruby>{kanji_stem}<rt>{kana_stem}</rt></ruby>{kana_form[len(kana_stem):]}"
        return kana_form

    return [
        { "id": "dict", "name": "Bentuk Kamus", "jpName": "辞書形", "ruby": make_ruby(kana), "romaji": verb['romaji'], "desc": "Bentuk dasar.", "example": f"{verb['kanji']} ({verb['meaning']})" },
        { "id": "masu", "name": "Bentuk Masu", "jpName": "ます形", "ruby": make_ruby(masu), "romaji": verb['romaji'] + "masu", "desc": "Bentuk sopan.", "example": f"{masu} ({verb['meaning']})" },
        { "id": "te", "name": "Bentuk Te", "jpName": "て形", "ruby": make_ruby(te), "romaji": verb['romaji'][:-1] + "te", "desc": "Untuk menyambung kalimat.", "example": f"{te} ({verb['meaning']})" },
        { "id": "ta", "name": "Bentuk Lampau", "jpName": "た形", "ruby": make_ruby(ta), "romaji": verb['romaji'][:-1] + "ta", "desc": "Menyatakan lampau.", "example": f"{ta} ({verb['meaning']})" },
        { "id": "nai", "name": "Bentuk Negatif", "jpName": "ない形", "ruby": make_ruby(nai), "romaji": verb['romaji'][:-1] + "nai", "desc": "Bentuk negatif.", "example": f"{nai} ({verb['meaning']})" },
        { "id": "potential", "name": "Bentuk Potensial", "jpName": "可能形", "ruby": make_ruby(potential), "romaji": verb['romaji'][:-1] + "eru", "desc": "Bisa melakukan.", "example": f"{potential} ({verb['meaning']})" },
        { "id": "volitional", "name": "Bentuk Volisional", "jpName": "意向形", "ruby": make_ruby(volitional), "romaji": verb['romaji'][:-1] + "ou", "desc": "Ayo melakukan.", "example": f"{volitional} ({verb['meaning']})" },
        { "id": "conditional", "name": "Bentuk Kondisional", "jpName": "条件形", "ruby": make_ruby(conditional), "romaji": verb['romaji'][:-1] + "eba", "desc": "Jika melakukan.", "example": f"{conditional} ({verb['meaning']})" },
        { "id": "imperative", "name": "Bentuk Perintah", "jpName": "命令形", "ruby": make_ruby(imperative), "romaji": verb['romaji'][:-1] + "e", "desc": "Perintah tegas.", "example": f"{imperative} ({verb['meaning']})" },
        { "id": "passive", "name": "Bentuk Pasif", "jpName": "受身形", "ruby": make_ruby(passive), "romaji": verb['romaji'][:-1] + "areru", "desc": "Dikenai tindakan.", "example": f"{passive} ({verb['meaning']})" },
        { "id": "causative", "name": "Bentuk Kausatif", "jpName": "使役形", "ruby": make_ruby(causative), "romaji": verb['romaji'][:-1] + "aseru", "desc": "Menyuruh melakukan.", "example": f"{causative} ({verb['meaning']})" }
    ]

print("Sedang memproses konjugasi...")

result = []
for v in verbs:
    result.append({
        "kanji": v['kanji'],
        "kana": v['kana'],
        "romaji": v['romaji'],
        "meaning": v['meaning'],
        "type": v['type'],
        "forms": conjugate(v)
    })

# Simpan ke folder data/
out_path = os.path.join(os.path.dirname(__file__), 'data', 'conjugations.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Sukses! {len(result)} kata kerja berhasil dibuat.")
print(f"File disimpan di: {out_path}")