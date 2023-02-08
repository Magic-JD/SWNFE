class PC {
    constructor(div) {
        this.div = div
        this.hp = null;
        this.attackBonus = null;
        this.savingThrow = null;
        this.initClassStats = function () {
            let calculated = Math.floor(Math.random() * 6) + 1
            if (this.class.find(s => s.includes("Warrior"))) {
                calculated += 2;
            }
            calculated += this.stats.filter(s => s.name == "Constitution").map(s => s.mod())[0]
            this.hp = Math.max(1, calculated)

            this.attackBonus = 0;
            if (this.class.find(s => s.includes("Warrior"))) {
                this.attackBonus += 1;
            }

            this.savingThrow = []
            let stats = this.stats
            this.savingThrow.push({
                name: 'Physical',
                value: 15 - Math.max(stats.find(s => s.name == "Strength").mod(), stats.find(s => s.name == "Constitution").mod())
            })
            this.savingThrow.push({
                name: 'Evasion',
                value: 15 - Math.max(stats.find(s => s.name == "Intelligence").mod(), stats.find(s => s.name == "Dexterity").mod())
            })
            this.savingThrow.push({
                name: 'Mental',
                value: 15 - Math.max(stats.find(s => s.name == "Wisdom").mod(), stats.find(s => s.name == "Charisma").mod())
            })

            this.updateDisplay()
        }
        this.displayHP = function () {
            if (this.hp) {
                return `HP: ${this.hp}`
            } else {
                return ''
            }
        }
        this.displayAttackBonus = function () {
            if (this.attackBonus != null) {
                return `Attack Bonus: ${this.attackBonus}`
            } else {
                return ''
            }
        }
        this.displaySavingThrows = function () {
            if (this.savingThrow) {
                return `Saving Throws:<br>${this.savingThrow.map(ab => `${ab.name}: ${ab.value}`).join('<br>')}`
            } else {
                return ''
            }
        }
        this.stats = [] //see stat
        this.setStats = function (statList) {
            this.stats = statList.sort((a, b) => a.priority - b.priority)
            this.updateDisplay()
        }
        this.displayStats = function () { return this.stats.map(stat => { return stat.toString() }).join('<br>') }
        this.updateStat = function (name, value) {
            const stat = this.stats.find(stat => stat.name.toLowerCase() == name.toLowerCase())
            stat.value = value
            this.updateDisplay()
        }
        this.origin = null
        this.setOrigin = function (origin) {
            this.origin = origin
            this.updateDisplay()
        }
        this.displayOrigin = function () { return this.origin ? `${this.origin.name}: ${this.origin.shortDescription}` : '' }
        this.skills = []
        this.addSkill = function (skill) {
            this.skills.push(skill);
            this.updateDisplay();
        }
        this.displaySkills = function () { return this.skills.join('<br>') }
        this.class = []
        this.displayClass = function () { return this.class.join('<br>') }
        this.addClass = function (string) {
            this.class.push(string)
            this.updateDisplay()
        }
        this.foci = []
        this.toString = function () {
            return [this.displayStats(), this.displayOrigin(), this.displaySkills(), this.displayClass(), this.displayHP(), this.displayAttackBonus(), this.displaySavingThrows()].filter(str => str != '').join('<br><br>')
        }
        this.updateDisplay = function () {
            this.div.innerHTML = this.toString()
        }
    }
}

export class Stat {
    constructor(name, value, priority) {
        this.name = name
        this.value = value
        this.mod = function () {
            if (this.value == 3) {
                return -2;
            } else if (this.value <= 7) {
                return -1
            } else if (this.value <= 13) {
                return 0;
            } else if (this.value <= 17) {
                return +1
            } else { return +2 }
        }
        this.priority = priority
        this.toString = function () {
            const mod = this.mod()
            return `${this.name}: ${this.value} [${mod > 0 ? '+' : mod < 0 ? '-' : ''}${Math.abs(mod)}]`
        }
    }
}

const pc = new PC(document.getElementById("pc-display"))

export function getPC() {
    return pc
}