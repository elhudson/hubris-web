import { get_proficiency, get_tier } from "../utils";
import { v4 } from "uuid";
export class character {
    constructor(data) {
        Object.assign(data, this);
    }
    create(user) {
        return {
            id: v4(),
            usersId: user.id,
            str: -2,
            dex: -2,
            con: -2,
            int: -2,
            wis: -2,
            cha: -2,
            classes: [],
            backgrounds: [],
            biography: {
                name: `${user.username}'s Character`,
                gender: "",
                alignment: "lg",
                backstory: "",
                appearance: "",
            },
            xp_earned: 6,
            burn: 0,
            font: null,
            campaignId: null,
            updated: new Date(),
        };
    }
    proficiency(character) {
        return get_proficiency(character);
    }
    tier(character) {
        return get_tier(character);
    }
}
