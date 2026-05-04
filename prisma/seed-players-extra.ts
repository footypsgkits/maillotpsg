import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter, log: ["error"] });

type PlayerSeed = {
  slug: string;
  name: string;
  firstName?: string;
  lastName?: string;
  number?: number;
  position: string;
  nationality: string;
  era: "actuel" | "legende";
  position2: number;
  metaTitle: string;
  metaDesc: string;
  bio: string;
};

const PLAYERS: PlayerSeed[] = [
  // ─── Effectif 2025-2026 manquants ────────────────────────────────────────
  {
    slug: "nuno-mendes",
    name: "Nuno Mendes",
    firstName: "Nuno",
    lastName: "Mendes",
    number: 25,
    position: "Défenseur latéral gauche",
    nationality: "PT",
    era: "actuel",
    position2: 11,
    metaTitle: "Maillot PSG Nuno Mendes n°25. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Nuno Mendes (n°25). Latéral gauche portugais, finaliste UEFA Nations League. Tailles S à 3XL et enfant.",
    bio: `Nuno Mendes est le latéral gauche du Paris Saint-Germain, arrivé du Sporting Portugal en 2021. International portugais, il s'est imposé comme l'un des meilleurs à son poste en Europe grâce à son explosivité, sa qualité de centre et sa rigueur défensive. Il porte le numéro 25 au PSG.

Auteur d'une finale de Ligue des champions 2025 remarquable face à l'Inter Milan, il a joué un rôle clé dans le premier sacre européen du club. Sa polyvalence (latéral, piston, parfois ailier) en fait un atout précieux dans le système de Luis Enrique.

Le maillot Nuno Mendes 25 est l'un des plus demandés au rayon défense du PSG. Tous nos maillots du PSG (domicile, extérieur, third, fourth, gardien, retro) peuvent être floqués au nom de Nuno Mendes en typographie officielle Ligue 1 ou UEFA Champions League.`,
  },
  {
    slug: "beraldo",
    name: "Lucas Beraldo",
    firstName: "Lucas",
    lastName: "Beraldo",
    number: 35,
    position: "Défenseur central",
    nationality: "BR",
    era: "actuel",
    position2: 6,
    metaTitle: "Maillot PSG Lucas Beraldo n°35. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Lucas Beraldo (n°35). Défenseur central brésilien, formé à São Paulo. Toutes tailles, livraison 9-12 jours.",
    bio: `Lucas Beraldo est un défenseur central brésilien formé à São Paulo, recruté par le Paris Saint-Germain en janvier 2024. Gaucher, technique et calme à la relance, il porte le numéro 35 au PSG.

Sa première saison complète au club l'a vu prendre une part importante dans la rotation défensive aux côtés de Marquinhos et Willian Pacho, contribuant au sacre en Ligue des champions 2025. International brésilien depuis 2024, il représente l'avenir de l'arrière-garde parisienne.

Le maillot Beraldo 35 est apprécié des supporters qui aiment les jeunes défenseurs au profil moderne. Tous nos maillots PSG sont floquables au nom de Beraldo, en tailles adulte (S à 3XL) et enfant (4 à 16 ans).`,
  },
  {
    slug: "pacho",
    name: "Willian Pacho",
    firstName: "Willian",
    lastName: "Pacho",
    number: 51,
    position: "Défenseur central",
    nationality: "EC",
    era: "actuel",
    position2: 7,
    metaTitle: "Maillot PSG Willian Pacho n°51. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Willian Pacho (n°51). Défenseur central équatorien, recruté de l'Eintracht Francfort. Toutes tailles.",
    bio: `Willian Pacho est un défenseur central équatorien arrivé au Paris Saint-Germain à l'été 2024 en provenance de l'Eintracht Francfort. Gaucher, puissant, rapide et excellent dans le duel, il s'est immédiatement imposé comme un titulaire indiscutable aux côtés de Marquinhos. Il porte le numéro 51.

Champion d'Europe 2025 avec le PSG dès sa première saison, Pacho a été l'un des piliers défensifs de l'épopée parisienne en Ligue des champions. International équatorien, il fait partie des meilleurs défenseurs centraux de moins de 25 ans en Europe.

Tous nos maillots PSG (domicile, extérieur, third, fourth, gardien) peuvent être floqués au nom de Pacho 51 en typographie officielle.`,
  },
  {
    slug: "ramos-goncalo",
    name: "Gonçalo Ramos",
    firstName: "Gonçalo",
    lastName: "Ramos",
    number: 9,
    position: "Attaquant",
    nationality: "PT",
    era: "actuel",
    position2: 12,
    metaTitle: "Maillot PSG Gonçalo Ramos n°9. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Gonçalo Ramos (n°9). Avant-centre portugais, finisseur clinique. Toutes tailles, floquage personnalisé.",
    bio: `Gonçalo Ramos est l'avant-centre portugais du Paris Saint-Germain, arrivé du Benfica à l'été 2023. Finisseur clinique, puissant dans la surface, il porte le numéro 9 historique du PSG, héritage de Cavani et Pauleta.

International portugais révélé lors de la Coupe du monde 2022 (triplé contre la Suisse en huitièmes), Gonçalo Ramos s'est imposé comme une option offensive majeure pour Luis Enrique. Buteur clé dans la campagne 2024-2025 qui a vu le PSG décrocher son premier sacre en Ligue des champions, il combine présence physique et instinct devant le but.

Le maillot Gonçalo Ramos 9 est très demandé par les fans qui aiment les avants-centres puissants. Tous nos maillots PSG sont floquables à son nom.`,
  },
  {
    slug: "zaire-emery",
    name: "Warren Zaïre-Emery",
    firstName: "Warren",
    lastName: "Zaïre-Emery",
    number: 33,
    position: "Milieu central",
    nationality: "FR",
    era: "actuel",
    position2: 13,
    metaTitle: "Maillot PSG Warren Zaïre-Emery n°33. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Warren Zaïre-Emery (n°33). Pépite française du milieu, formé au PSG. Tailles adulte et enfant.",
    bio: `Warren Zaïre-Emery est une pépite française du Paris Saint-Germain, formée intégralement au club. Devenu le plus jeune buteur de l'histoire du PSG en Ligue des champions à seulement 17 ans, il porte aujourd'hui le numéro 33 et représente l'incarnation du projet de formation parisien.

Milieu central polyvalent, à l'aise dans la récupération comme dans la projection, "WZE" est international français A depuis l'âge de 17 ans. Sa progression rapide et son attachement au club font de lui l'un des chouchous du Parc des Princes.

Faire floquer le maillot PSG au nom de Zaïre-Emery est un choix très populaire chez les jeunes supporters. Tous nos maillots PSG sont disponibles avec ce floquage en tailles adulte (S à 3XL) et enfant (4 à 16 ans).`,
  },
  {
    slug: "lee-kang-in",
    name: "Lee Kang-in",
    firstName: "Kang-in",
    lastName: "Lee",
    number: 19,
    position: "Milieu offensif",
    nationality: "KR",
    era: "actuel",
    position2: 14,
    metaTitle: "Maillot PSG Lee Kang-in n°19. Floquage 5 €.",
    metaDesc:
      "Maillot PSG floqué Lee Kang-in (n°19). Milieu sud-coréen, technique et créatif. Floquage personnalisé inclus.",
    bio: `Lee Kang-in est le milieu offensif sud-coréen du Paris Saint-Germain, arrivé de Majorque à l'été 2023. Gaucher virtuose, technique pure, il porte le numéro 19 au club.

Capitaine emblématique de la sélection coréenne, "Kang-in" est connu pour ses dribbles courts, sa capacité à provoquer et ses frappes lointaines. Au PSG, il évolue en soutien des attaquants ou sur l'aile droite, apportant créativité et imprévisibilité.

Le maillot Lee Kang-in 19 est particulièrement populaire auprès de la communauté asiatique et des supporters qui apprécient les joueurs créatifs. Tous nos maillots PSG (domicile, extérieur, third, fourth) peuvent être floqués à son nom en typographie officielle.`,
  },
  {
    slug: "chevalier",
    name: "Lucas Chevalier",
    firstName: "Lucas",
    lastName: "Chevalier",
    number: 30,
    position: "Gardien de but",
    nationality: "FR",
    era: "actuel",
    position2: 15,
    metaTitle: "Maillot Gardien PSG Lucas Chevalier n°30. Floquage 5 €.",
    metaDesc:
      "Maillot gardien PSG floqué Lucas Chevalier (n°30). Gardien français recruté de Lille à l'été 2025. Toutes tailles.",
    bio: `Lucas Chevalier est un gardien de but français recruté par le Paris Saint-Germain à l'été 2025 en provenance du LOSC Lille. Considéré comme l'un des meilleurs portiers français de sa génération, il porte le numéro 30 au PSG.

Excellent dans son jeu au pied, performant dans les sorties aériennes et sur sa ligne, Chevalier complète parfaitement le rôle de Donnarumma dans la rotation des gardiens. International français, il représente l'avenir du poste en équipe de France après Mike Maignan.

Le maillot gardien Chevalier 30 est disponible avec floquage en tailles adulte et enfant. Coloris distinctifs (vert, noir, rose) selon les saisons et option manches longues souvent disponible.`,
  },

  // ─── Légendes manquantes ─────────────────────────────────────────────────
  {
    slug: "messi",
    name: "Lionel Messi",
    firstName: "Lionel",
    lastName: "Messi",
    number: 30,
    position: "Attaquant / Milieu offensif",
    nationality: "AR",
    era: "legende",
    position2: 1,
    metaTitle: "Maillot PSG Lionel Messi n°30. Édition 2021-2023.",
    metaDesc:
      "Maillot PSG floqué Lionel Messi (n°30). Période parisienne 2021-2023, double Champion de France. Pièce collector.",
    bio: `Lionel Messi a porté le maillot du Paris Saint-Germain de 2021 à 2023, après son départ légendaire du FC Barcelone. Septuple Ballon d'Or à son arrivée, il a hérité du numéro 30, son numéro initial à La Masia.

Pendant ses deux saisons parisiennes, Messi a remporté deux titres de champion de France (2021-2022, 2022-2023), un Trophée des Champions et a inscrit 32 buts en 75 matchs avec le club. Au cœur de cette période, il a également décroché la Coupe du monde 2022 avec l'Argentine, son trophée le plus convoité.

Le maillot Messi 30 du PSG est aujourd'hui une pièce collector très recherchée. Notre catalogue propose les modèles domicile, extérieur et third des saisons 2021-2022 et 2022-2023, tous floquables "MESSI 30" en typographie officielle Ligue 1.`,
  },
  {
    slug: "cavani",
    name: "Edinson Cavani",
    firstName: "Edinson",
    lastName: "Cavani",
    number: 9,
    position: "Attaquant",
    nationality: "UY",
    era: "legende",
    position2: 2,
    metaTitle: "Maillot PSG Edinson Cavani n°9. Meilleur buteur de l'histoire.",
    metaDesc:
      "Maillot PSG floqué Edinson Cavani (n°9). Meilleur buteur de l'histoire du PSG (200 buts). Pièce rétro collector.",
    bio: `Edinson Cavani est le meilleur buteur de l'histoire du Paris Saint-Germain avec 200 réalisations en 301 matchs entre 2013 et 2020. Connu sous le surnom de "El Matador", l'Uruguayen a porté le numéro 9 du club pendant 7 saisons et 6 titres de champion de France.

Buteur travailleur, élégant dans le jeu de tête et les courses dans la profondeur, Cavani est resté longtemps loin devant tous les autres goleadors parisiens, jusqu'à ce que son record paraisse intouchable.

Le maillot Cavani 9 est l'un des plus emblématiques des années QSI au Parc des Princes. Notre rayon rétro propose les modèles domicile et extérieur de plusieurs saisons (2013-2020), tous floquables "CAVANI 9".`,
  },
  {
    slug: "thiago-silva",
    name: "Thiago Silva",
    firstName: "Thiago",
    lastName: "Silva",
    number: 2,
    position: "Défenseur central / Capitaine",
    nationality: "BR",
    era: "legende",
    position2: 3,
    metaTitle: "Maillot PSG Thiago Silva n°2. Capitaine légendaire.",
    metaDesc:
      "Maillot PSG floqué Thiago Silva (n°2). Capitaine emblématique du PSG (2012-2020). Pièce rétro collector.",
    bio: `Thiago Silva a été le capitaine emblématique du Paris Saint-Germain de 2012 à 2020. Recruté du Milan AC pour un montant record à l'époque, le défenseur central brésilien a porté le numéro 2 et le brassard parisien pendant huit saisons.

Considéré comme l'un des meilleurs défenseurs du monde de sa génération, "O Monstro" a remporté 7 titres de champion de France et a mené le PSG en finale de Ligue des champions 2020. Sa lecture du jeu, sa propreté technique et son leadership ont marqué une décennie au club.

Le maillot Thiago Silva 2 est un classique du rayon rétro PSG, particulièrement les modèles 2012-2020. Notre catalogue propose les saisons phares de son passage au club, tous floquables.`,
  },
  {
    slug: "verratti",
    name: "Marco Verratti",
    firstName: "Marco",
    lastName: "Verratti",
    number: 6,
    position: "Milieu central",
    nationality: "IT",
    era: "legende",
    position2: 4,
    metaTitle: "Maillot PSG Marco Verratti n°6. Légende du milieu.",
    metaDesc:
      "Maillot PSG floqué Marco Verratti (n°6). Milieu italien légendaire (2012-2023). 9 titres de champion de France.",
    bio: `Marco Verratti est l'une des plus grandes légendes du Paris Saint-Germain, avec 11 saisons au club entre 2012 et 2023. Le "Petit Hibou" italien, recruté de Pescara, a porté le numéro 6 et a remporté 9 titres de champion de France, un record absolu pour un milieu de terrain au PSG.

Champion d'Europe avec l'Italie en 2021, Verratti est connu pour sa qualité technique exceptionnelle, sa capacité à éliminer le pressing en deux touches et sa passion débordante. Il a marqué une époque en formant le cerveau créatif des PSG QSI aux côtés de Pastore, Motta puis Vitinha.

Le maillot Verratti 6 reste l'un des plus prisés au rayon rétro. Notre catalogue propose ses saisons phares (2012-2023), tous floquables "VERRATTI 6".`,
  },
  {
    slug: "di-maria",
    name: "Ángel Di María",
    firstName: "Ángel",
    lastName: "Di María",
    number: 11,
    position: "Ailier",
    nationality: "AR",
    era: "legende",
    position2: 5,
    metaTitle: "Maillot PSG Ángel Di María n°11. 7 saisons légendaires.",
    metaDesc:
      "Maillot PSG floqué Ángel Di María (n°11). 7 saisons au PSG (2015-2022). Champion du monde 2022 avec l'Argentine.",
    bio: `Ángel Di María a porté le maillot du Paris Saint-Germain pendant 7 saisons, de 2015 à 2022. Recruté de Manchester United, l'Argentin a porté le numéro 11 et est devenu l'un des joueurs les plus aimés du Parc des Princes grâce à son sens du sacrifice et ses coups francs millimétrés.

Auteur de 92 buts et 119 passes décisives en 295 matchs au PSG, "Fideo" a remporté 5 titres de champion de France et de nombreux trophées nationaux. Champion du monde 2022 avec l'Argentine (où il a marqué en finale face à la France), il fait partie du panthéon des grands joueurs sud-américains de l'histoire du club.

Le maillot Di María 11 est un classique du rayon rétro. Notre catalogue propose les modèles 2015-2022, tous floquables "DI MARIA 11".`,
  },
  {
    slug: "icardi",
    name: "Mauro Icardi",
    firstName: "Mauro",
    lastName: "Icardi",
    number: 9,
    position: "Attaquant",
    nationality: "AR",
    era: "legende",
    position2: 6,
    metaTitle: "Maillot PSG Mauro Icardi n°9. Maillot rétro 2019-2022.",
    metaDesc:
      "Maillot PSG floqué Mauro Icardi (n°9). Avant-centre argentin au PSG entre 2019 et 2022. Pièce rétro collector.",
    bio: `Mauro Icardi a porté le maillot du Paris Saint-Germain entre 2019 et 2022. Recruté en prêt puis acheté définitivement à l'Inter Milan, l'attaquant argentin a porté le numéro 9 au club et inscrit 38 buts en 92 matchs.

Renard des surfaces dans la pure tradition italienne, Icardi a vécu des moments forts (notamment sa frappe décisive contre Lille en 2020) et plus difficiles au PSG, mais son maillot reste apprécié des fans qui ont suivi cette période riche en stars.

Notre catalogue rétro propose les maillots Icardi 9 des saisons 2019-2022, tous floquables en typographie officielle Ligue 1.`,
  },
  {
    slug: "sergio-ramos",
    name: "Sergio Ramos",
    firstName: "Sergio",
    lastName: "Ramos",
    number: 4,
    position: "Défenseur central",
    nationality: "ES",
    era: "legende",
    position2: 7,
    metaTitle: "Maillot PSG Sergio Ramos n°4. Saisons 2021-2023.",
    metaDesc:
      "Maillot PSG floqué Sergio Ramos (n°4). Défenseur espagnol légendaire au PSG entre 2021 et 2023. Rétro collector.",
    bio: `Sergio Ramos a porté le maillot du Paris Saint-Germain entre 2021 et 2023, après une carrière monumentale au Real Madrid. Le défenseur central espagnol, quadruple vainqueur de la Ligue des champions et champion du monde 2010, a porté le numéro 4 au club.

Sa première saison parisienne fut perturbée par les blessures, mais il a livré une saison 2022-2023 pleine, contribuant au titre de champion de France et apportant son leadership et son expérience au vestiaire. Il a inscrit 6 buts en 58 matchs.

Le maillot Sergio Ramos 4 est devenu une pièce collector très demandée. Notre catalogue rétro propose les modèles des deux saisons (2021-2022 et 2022-2023), tous floquables.`,
  },
  {
    slug: "pastore",
    name: "Javier Pastore",
    firstName: "Javier",
    lastName: "Pastore",
    number: 27,
    position: "Milieu offensif",
    nationality: "AR",
    era: "legende",
    position2: 8,
    metaTitle: "Maillot PSG Javier Pastore n°27. Premier prince de QSI.",
    metaDesc:
      "Maillot PSG floqué Javier Pastore (n°27). Premier grand transfert QSI (2011-2018). Maillot rétro collector.",
    bio: `Javier Pastore est l'un des joueurs les plus emblématiques de l'ère QSI au Paris Saint-Germain. "El Flaco", recruté de Palerme à l'été 2011 pour un montant record alors, est devenu le premier grand transfert symbolique du nouveau projet parisien. Il a porté le numéro 27 pendant 7 saisons (2011-2018).

Milieu offensif argentin de grande classe technique, Pastore a marqué les supporters par ses dribbles élégants, ses extérieurs du pied et ses gestes de génie. Il a remporté 5 titres de champion de France et reste une référence pour de nombreux fans qui ont vécu les premières années QSI.

Le maillot Pastore 27 est un classique du rayon rétro PSG. Notre catalogue propose les modèles 2011-2018, tous floquables "PASTORE 27".`,
  },
  {
    slug: "weah",
    name: "George Weah",
    firstName: "George",
    lastName: "Weah",
    number: 9,
    position: "Attaquant",
    nationality: "LR",
    era: "legende",
    position2: 9,
    metaTitle: "Maillot PSG George Weah n°9. Ballon d'Or 1995.",
    metaDesc:
      "Maillot PSG floqué George Weah (n°9). Ballon d'Or 1995, légende du PSG des années 90. Maillot rétro vintage.",
    bio: `George Weah est l'une des plus grandes légendes de l'histoire du Paris Saint-Germain. L'attaquant libérien a porté le maillot parisien de 1992 à 1995, période durant laquelle il a remporté son Ballon d'Or 1995 et le Trophée du meilleur joueur de la FIFA.

Puissant, rapide, technique et capable de gestes de génie (sa course de 90 mètres face à Hellas Vérone reste mythique), Weah a marqué l'ère pré-Bosman du PSG. Il a remporté la Coupe de France 1993 et 1995, et a porté le club en demi-finale de Coupe d'Europe.

Le maillot rétro Weah 9 est une pièce vintage très recherchée par les collectionneurs. Notre catalogue propose les modèles iconiques de cette époque (1992-1995, sponsor Müller), tous floquables.`,
  },
  {
    slug: "ronaldinho",
    name: "Ronaldinho",
    firstName: "Ronaldo",
    lastName: "de Assis Moreira",
    number: 21,
    position: "Milieu offensif",
    nationality: "BR",
    era: "legende",
    position2: 10,
    metaTitle: "Maillot PSG Ronaldinho n°21. Maillot rétro 2001-2003.",
    metaDesc:
      "Maillot PSG floqué Ronaldinho (n°21). Légende brésilienne au PSG entre 2001 et 2003. Maillot rétro collector.",
    bio: `Ronaldinho a porté le maillot du Paris Saint-Germain de 2001 à 2003. Le génie brésilien, alors âgé de 21 ans à son arrivée du Grêmio, a illuminé le Parc des Princes par sa technique stratosphérique, son sourire et ses gestes inattendus, avant de rejoindre le FC Barcelone et de remporter le Ballon d'Or.

À Paris, "Dinho" a porté le numéro 21 et a inscrit 25 buts en 86 matchs sous le maillot parisien. Beaucoup de supporters considèrent qu'il a posé les jalons d'une nouvelle ère de glamour pour le PSG, plusieurs années avant l'arrivée des QSI.

Le maillot Ronaldinho 21 du PSG saisons 2001-2002 et 2002-2003 (avec le sponsor Thomson) est l'un des maillots rétro PSG les plus iconiques jamais produits. Notre catalogue le propose en édition vintage, floquable.`,
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const p of PLAYERS) {
    const existing = await prisma.player.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.player.update({
        where: { slug: p.slug },
        data: {
          name: p.name,
          firstName: p.firstName,
          lastName: p.lastName,
          number: p.number,
          position: p.position,
          nationality: p.nationality,
          era: p.era,
          position2: p.position2,
          metaTitle: p.metaTitle,
          metaDesc: p.metaDesc,
          bio: p.bio,
          active: true,
        },
      });
      updated++;
    } else {
      await prisma.player.create({
        data: {
          slug: p.slug,
          name: p.name,
          firstName: p.firstName,
          lastName: p.lastName,
          number: p.number,
          position: p.position,
          nationality: p.nationality,
          era: p.era,
          position2: p.position2,
          metaTitle: p.metaTitle,
          metaDesc: p.metaDesc,
          bio: p.bio,
          active: true,
        },
      });
      created++;
    }
  }

  console.log(`✅ Joueurs : ${created} créés, ${updated} mis à jour.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
