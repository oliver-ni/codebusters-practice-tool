const { createApp } = Vue;

const choose = arr => arr[Math.floor(Math.random() * arr.length)];

const shuffleArray = arr => arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const letters = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9,
    "K": 10,
    "L": 11,
    "M": 12,
    "N": 13,
    "O": 14,
    "P": 15,
    "Q": 16,
    "R": 17,
    "S": 18,
    "T": 19,
    "U": 20,
    "V": 21,
    "W": 22,
    "X": 23,
    "Y": 24,
    "Z": 25,
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const app = createApp({
    data() {
        return {
            alphabet: alphabet,
            original: "",
            author: "",
            encode: [...Array(26).keys()],
            decode: Array(26).fill(-1),
            difficulty: getDefaultDifficulty(),
            patristocrat: false,
        }
    },
    computed: {
        plaintext() {
            if (!this.patristocrat) return this.original;
            return Array.from(this.original).filter(x => alphabet.includes(x)).reduce((acc, curr, idx) => idx % 5 === 0 ? acc + " " + curr : acc + curr);
        },
        ciphertext() {
            return Array.prototype.map.call(this.plaintext, x => {
                if (alphabet.includes(x) && x != " ") {
                    return alphabet[this.encode[letters[x]]];
                } else {
                    return x;
                }
            }).join("");
        },
        decodedMessage() {
            return Array.prototype.map.call(this.ciphertext, x => {
                if (alphabet.includes(x) && x != " ") {
                    return this.decodeLetter(x);
                } else {
                    return x;
                }
            }).join("");
        },
        wordByWord() {
            return this.ciphertext.split(" ");
        },
        isSolved() {
            return this.decodedMessage == this.plaintext;
        },
    },
    methods: {
        letterToIdx(x) {
            return letters[x];
        },
        updateDecode(e, letter) {
            if (alphabet.includes(e.key.toUpperCase())) {
                this.decode[letters[letter]] = letters[e.key.toUpperCase()];
            }
            e.preventDefault();
        },
        isDupe(x) {
            let already = false;
            for (let i = 0; i < this.decode.length; i++) {
                if (alphabet[this.decode[i]] == x) {
                    if (already) return true;
                    already = true;
                }
            }
            return false;
        },
        deleteDecode(e, letter) {
            this.decode[letters[letter]] = -1;
            e.preventDefault();
        },
        randomMap() {
            let map;
            do {
                map = shuffleArray([...Array(26).keys()]);
            } while (map.some((x, i) => x == i));
            return map;
        },
        decodeLetter(x) {
            if (!alphabet.includes(x)) return x;
            if (this.decode[letters[x]] > -1) return alphabet[this.decode[letters[x]]];
            else return "";
        },
        newProblem() {
            const quote = choose(QUOTES[this.difficulty]);
            this.original = quote.text.toUpperCase();
            this.author = quote.author;
            this.encode = this.randomMap();
            this.decode = Array(26).fill(-1);
        },
        changeDifficulty(difficulty) {
            setDefaultDifficulty(difficulty);
            this.difficulty = difficulty;
            this.newProblem();
        },
        togglePatristocrat() {
            this.patristocrat = !this.patristocrat;
        },
        countLetter(str, letter) {
            var regExp = new RegExp(letter, "g");
            return (str.match(regExp) || []).length;
        },
        zip(...rows) {
            return [...rows[0]].map((_, c) => rows.map(row => row[c]));
        }
    },
    created() {
        this.newProblem();
    }
}).mount("#main");
