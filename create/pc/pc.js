const pc = {
    stats: [], //list {name, value, mod}
    setStats: function (statList) {this.stats = statList.sort((a, b) => a.priority - b.priority)},
    origin: {
        name: null,
        description: null,
        freeSkill: null,
        quickSkills: [],
        growth: [],
        learning: []
    },
    skills: [],
    class: null,
    foci: []
}

export class Stat{
    constructor(name, value, mod, priority) {
        this.name = name
        this.value = value
        this.mod = mod
        this.priority = priority
        this.toString = function (){ 
            return `${name}: ${value} [${mod > 0 ? '+' : mod < 0 ? '-' : ''}${Math.abs(mod)}]`
        }
    }
}

export function getPC(){
    return pc
}