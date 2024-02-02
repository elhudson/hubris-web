import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const test = [
  {
    author: {
      backgrounds: [
        {
          abilitiesId: "515e1331-adf8-467f-a196-4c848d6e43bb",
          description: "",
          id: "81cdc99f-85aa-4570-92e9-81b1e87dd7f2",
          settingsId: "c6e57ee5-a805-4cff-ac88-76f779116b0e",
          skillsId: null,
          title: "Ghost"
        },
        {
          abilitiesId: "06911990-9f2d-494f-9d08-77c268d3c2ad",
          description: "",
          id: "da0574c9-3355-4644-9618-3b44b355a095",
          settingsId: "54007770-4641-4ce8-8265-dc24b23cab84",
          skillsId: "c002c2e2-b153-4cc1-b7cd-e6082280fe4f",
          title: "Noble"
        }
      ],
      biography: {
        alignment: "tn",
        appearance: "",
        backstory: "",
        gender: "Male",
        name: "Valancy Frederick Gawaine de Camlynn"
      },
      burn: 1,
      campaignId: "a91283b3-d048-4328-b77c-2bad1b541c3e",
      cha: 4,
      classes: [
        {
          armory: "Light",
          description: "",
          hit_DiceId: "c8a0ea1f-69b2-4acc-a9d7-7bdd74b35e2e",
          id: "06374215-a0da-4584-a6ce-16ea154c41a9",
          title: "Elementalist",
          weaponry: "Simple"
        },
        {
          armory: "Light",
          description: "",
          hit_DiceId: "c8a0ea1f-69b2-4acc-a9d7-7bdd74b35e2e",
          id: "3f152314-b576-4d96-ac26-41feead6b73e",
          title: "Beguiler",
          weaponry: "Simple"
        }
      ],
      con: 3,
      dex: 0,
      id: "c54d3ace-a0dd-4444-adc0-8ba35bdf2496",
      int: 4,
      portrait: null,
      str: 0,
      updated: "2023-12-09T22:36:54.150Z",
      usersId: "ddd0c0ad-13c4-47d4-bdfb-a343985187d8",
      wis: -2,
      xp_earned: 40,
      xp_spent: 37
    },
    session: 2,
    text: "<p>kjhkjhkjhkjh</p>"
  }
];

const query = (summary) => ({
  author: {
    connect: {
      id: summary.author.id
    }
  },
  text: summary.text,
  session: summary.session,
  campaign: {
    connect: {
      id: summary.author.campaignId
    }
  }
});

const test_q = query(test[0]);

await prisma.summaries.upsert({
  where: {
    campaignId_session: {
        campaignId: test[0].author.campaignId,
        session: test[0].session
    }
  },
  create: test_q,
  update: test_q
});
