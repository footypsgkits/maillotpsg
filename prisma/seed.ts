import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter, log: ["error"] });

// ───── Catégories ─────
const cats = [
  {
    slug: "domicile",
    name: "Domicile",
    position: 1,
    description:
      "Le mythique maillot domicile bleu marine porté au Parc des Princes en Ligue 1, Coupe de France et Ligue des champions. Toutes les saisons et toutes les tailles, floquage personnalisé Mbappé, Dembélé, Hakimi, Marquinhos, Donnarumma.",
    longContent: `Le maillot PSG domicile est l'élément le plus iconique du Paris Saint-Germain. Bleu marine, parfois liseré rouge et blanc selon les saisons, il représente l'identité visuelle du club depuis sa création en 1970. Chaque année, l'équipementier Nike (depuis 2018) renouvelle le design tout en respectant les codes historiques : un panneau central, l'écusson PSG sur le cœur, le sponsor maillot et le logo Nike. Les supporters parisiens portent ce maillot au Parc des Princes lors des grandes affiches contre l'OM, l'OL, ou en Ligue des champions face au Real Madrid, Barcelone ou Manchester City.

Toutes nos références de maillot PSG domicile sont disponibles en tailles XS, S, M, L, XL, XXL et 3XL pour les adultes, et en 4 ans, 6 ans, 8 ans, 10 ans, 12 ans, 14 ans et 16 ans pour les enfants. Le floquage est personnalisable au nom et numéro du joueur de votre choix : Kylian Mbappé, Ousmane Dembélé, Achraf Hakimi, Marquinhos, Gianluigi Donnarumma, Vitinha, Bradley Barcola, Khvicha Kvaratskhelia, Désiré Doué ou João Neves. Vous pouvez également faire floquer votre propre nom et numéro pour un cadeau unique.`,
    metaTitle: "Maillot PSG Domicile — Toutes les saisons",
    metaDesc:
      "Maillot domicile du PSG : modèles 2025-2026 et saisons précédentes. Tailles XS à 3XL et tailles enfant 4-16 ans. Floquage personnalisé Mbappé, Dembélé, Hakimi.",
  },
  {
    slug: "exterieur",
    name: "Extérieur",
    position: 2,
    description:
      "Le maillot away porté lors des déplacements en Ligue 1 et Champions League. Disponible sur plusieurs saisons, avec floquage personnalisé inclus.",
    longContent: `Le maillot PSG extérieur est porté lors des déplacements à l'extérieur du Parc des Princes. Souvent dans des coloris contrastés — blanc, beige, sable, rose poudré ou rouge selon les saisons — il offre une alternative élégante au maillot domicile et constitue souvent la pièce préférée des collectionneurs. Le maillot extérieur 2024-2025 en blanc cassé avec sa bande rouge centrale a marqué les esprits, tout comme le maillot extérieur rose de 2021-2022.

Que vous soyez supporter au Vélodrome, au Groupama Stadium ou en déplacement européen à Madrid, Munich ou Manchester, le maillot away vous permet d'afficher vos couleurs sans craindre la confusion. Toutes les tailles adulte (XS à 3XL) et enfant (4 à 16 ans) sont disponibles, avec l'option floquage personnalisé en typographie officielle Ligue 1 ou UEFA Champions League selon la saison.`,
    metaTitle: "Maillot PSG Extérieur — Collection complète",
    metaDesc:
      "Maillots extérieur du PSG, toutes les saisons. Floquage personnalisé Mbappé, Dembélé, Hakimi. Livraison France 48h.",
  },
  {
    slug: "third",
    name: "Third",
    position: 3,
    description:
      "Le troisième maillot du PSG : la pièce la plus créative et la plus collector de la saison. Designs Nike audacieux et collaborations Jordan exceptionnelles.",
    longContent: `Le maillot PSG third est traditionnellement la tunique la plus créative et la plus collector de la saison. Depuis le partenariat historique entre le Paris Saint-Germain et la marque Jordan en 2018, les maillots third et fourth proposent des designs audacieux qui mêlent l'identité du PSG aux codes streetwear de la marque au Jumpman. C'est pour beaucoup de supporters le maillot favori : moins porté en match, il se distingue par ses choix graphiques uniques, ses coloris originaux (or, gris anthracite, fluo, ciel) et ses détails techniques.

Notre catalogue regroupe l'ensemble des maillots third récents et historiques du PSG, du modèle Jordan 2018-2019 noir à logos Jumpman dorés jusqu'aux versions les plus récentes. Floquage Mbappé, Dembélé, Hakimi, Donnarumma, Marquinhos disponible en tailles adulte XS à 3XL et enfant de 4 à 16 ans.`,
    metaTitle: "Maillot PSG Third — Le 3ème maillot saison par saison",
    metaDesc:
      "Maillot Third PSG par saison. Pièce collector Jordan, floquage inclus, livraison rapide en France.",
  },
  {
    slug: "gardien",
    name: "Gardien",
    position: 4,
    description:
      "Maillots de gardien du PSG portés par Donnarumma, Tenas et leurs prédécesseurs. Coupe spéciale, manches longues souvent disponibles, design audacieux.",
    longContent: `Le maillot de gardien du PSG est porté en match par Gianluigi Donnarumma, héros de la finale de Ligue des champions face à l'Inter Milan en 2025, ainsi que par Arnau Tenas et les autres portiers parisiens. Les maillots gardien adoptent des coloris qui se distinguent volontairement des couleurs du club et des adversaires : noir, vert fluo, rose, jaune. La coupe est légèrement plus ample, avec souvent une option manches longues très prisée, et des renforts au niveau des coudes pour les plongeons.

Tous nos maillots gardien PSG sont déclinés en tailles adulte (XS à 3XL) et enfant (4 à 16 ans). Le floquage personnalisé "DONNARUMMA 1" est disponible, tout comme la possibilité d'ajouter votre propre nom au dos pour les jeunes gardiens en herbe.`,
    metaTitle: "Maillot Gardien PSG — Donnarumma et historique",
    metaDesc:
      "Maillot de gardien du Paris Saint-Germain. Coupe portier, plusieurs saisons, floquage Donnarumma disponible.",
  },
  {
    slug: "enfant",
    name: "Enfant",
    position: 5,
    description:
      "Maillots PSG taillés pour les enfants : 4, 6, 8, 10, 12, 14 et 16 ans. Idéal cadeau d'anniversaire ou de Noël pour un jeune supporter parisien.",
    longContent: `Faire plaisir à un jeune supporter du PSG, c'est lui offrir un maillot floqué au nom de son joueur préféré. Notre rayon enfant propose l'ensemble des maillots du Paris Saint-Germain en tailles 4 ans, 6 ans, 8 ans, 10 ans, 12 ans, 14 ans et 16 ans : domicile, extérieur, third, gardien, training, et même les éditions Jordan. Chaque maillot enfant est disponible avec floquage personnalisé, ce qui en fait un cadeau d'anniversaire ou de Noël particulièrement apprécié.

Pour bien choisir la taille, référez-vous à la taille en cm ou à l'âge de l'enfant : 4 ans pour 102 cm, 6 ans pour 116 cm, 8 ans pour 128 cm, 10 ans pour 140 cm, 12 ans pour 152 cm, 14 ans pour 164 cm, 16 ans pour 176 cm. Si vous hésitez, prenez la taille au-dessus : votre enfant grandit vite et un maillot un peu large reste portable une saison de plus. L'échange de taille est gratuit chez Maillot-PSG.`,
    metaTitle: "Maillot PSG Enfant — 4 à 16 ans, cadeau supporter",
    metaDesc:
      "Maillot enfant du PSG du 4 au 16 ans. Floquage personnalisé Mbappé, Dembélé, Doué inclus, livraison France 48h.",
  },
  {
    slug: "training",
    name: "Training",
    position: 6,
    description:
      "Vestes, sweats, polos et survêtements d'entraînement officiels portés par les joueurs avant les matchs et au centre Ooredoo de Poissy.",
    longContent: `La gamme training du PSG regroupe l'ensemble des tenues portées par les joueurs avant les matchs, au centre d'entraînement Ooredoo à Poissy ou sur le banc. Vestes coupe-vent, sweats à capuche, t-shirts d'échauffement, polos, joggings, shorts d'entraînement : ce sont les pièces que les supporters portent au quotidien, en complément ou alternative au maillot. Plus discrètes mais souvent plus polyvalentes, elles permettent d'afficher son soutien au club tous les jours.

Toutes les tenues training PSG sont disponibles en tailles adulte (XS à 3XL) et la plupart en tailles enfant (4 à 16 ans). Floquage non disponible sur cette gamme.`,
    metaTitle: "Training PSG — Vestes, polos, survêtements officiels",
    metaDesc:
      "Tenues d'entraînement et survêtements officiels du PSG. Vestes, sweats, polos, joggings.",
  },
  {
    slug: "retro",
    name: "Rétro",
    position: 7,
    description:
      "Maillots PSG rétro et vintage : revivez les grandes saisons parisiennes. Maillots Ronaldinho, Pauleta, Ibrahimović, Beckham, Cavani, Neymar et l'ère Hechter.",
    longContent: `Les maillots PSG rétro racontent toute l'histoire du club, depuis sa fondation en 1970 jusqu'aux époques contemporaines. Notre sélection couvre les grandes périodes : l'ère Daniel Hechter et le maillot Ouest Foire des années 1970-1980, le maillot blanc bandes rouges et bleues des années 1990, le maillot Opel des années Ronaldinho (2001-2003), l'ère Thomson, BeIN Sports, Emirates jusqu'aux récents Qatar Airways. Chaque maillot est une pièce de collection, idéale pour les vrais passionnés du Paris Saint-Germain.

Parmi les références phares de notre catalogue rétro : le maillot domicile 2001-2002 floqué Ronaldinho n°21 (sa toute première saison à Paris), le maillot domicile 2012-2014 Ibrahimović n°10, le maillot domicile 2013-2014 Beckham n°32, le maillot domicile 2017-2018 Neymar n°10 ou Mbappé n°7, ou encore les maillots Cavani, Pauleta, Pastore, Lavezzi, Thiago Silva. Toutes les tailles adulte (XS à 3XL) sont disponibles selon les stocks. Pour les pièces les plus rares, n'hésitez pas à nous contacter.`,
    metaTitle: "Maillots PSG Rétro & Vintage — Toutes les saisons",
    metaDesc:
      "Maillots rétro PSG : Ronaldinho, Pauleta, Ibrahimović, Beckham, Cavani, Neymar. Pièces collector authentiques, toutes saisons.",
  },
  {
    slug: "edition-speciale",
    name: "Édition spéciale",
    position: 8,
    description:
      "Éditions limitées, collaborations Jordan, maillots des grandes finales et des classiques européens. Pièces rares à collectionner.",
    longContent: `Le PSG cultive son ADN parisien à travers de nombreuses collaborations et éditions limitées. Le partenariat avec la marque Jordan depuis 2018 a donné naissance à des maillots cultes : maillot Jordan x PSG 2018-2019 noir avec logos Jumpman dorés, fourth kit Jordan rouge 2025-2026, kits Air Jordan en édition limitée. Le club a également produit des maillots commémoratifs (50 ans du club, finale UCL 2020 et 2025), des kits pre-match exclusifs et des collaborations mode (Koché en 2021).

Ces pièces sont produites en quantités limitées et deviennent rapidement des objets de collection. Notre catalogue les regroupe avec une fiche détaillée pour chaque édition : occasion de la sortie, nombre d'exemplaires, design, joueurs floquables.`,
    metaTitle: "Éditions spéciales PSG — Jordan, finales, collabs",
    metaDesc:
      "Éditions limitées et collaborations PSG : Jordan, finales européennes, maillots collector exclusifs.",
  },
];

// ───── Saisons ─────
const seasons = [
  {
    slug: "2025-2026",
    label: "2025-2026",
    era: "actuelle",
    shirtMaker: "Nike",
    position: 1,
    description: `Le maillot PSG 2025-2026 a été dévoilé à l'été 2025 par Nike. Le design domicile s'inspire des trois monuments emblématiques de Paris — la Tour Eiffel, l'Arc de Triomphe et le Sacré-Cœur — avec une large bande centrale qui rompt avec la tradition du panneau classique. Les coloris bleu marine et rouge sont rehaussés d'une étoile dorée pour célébrer le triplé Coupe-Championnat-Ligue des champions remporté en 2024-2025. Le sponsor maillot principal est Qatar Airways.

Le maillot extérieur 2025-2026 reprend une coupe blanche minimaliste avec accents bleu et rouge, tandis que le third Nike adopte un coloris original. Le quatrième maillot Jordan, dévoilé en collaboration avec la marque au Jumpman, est rouge vif et constitue une pièce collector déjà très recherchée.

Effectif 2025-2026 : Donnarumma (1), Hakimi (2), Marquinhos (5), Vitinha (17), Fabian Ruiz (8), Joao Neves (87), Dembélé (10), Doué (14), Kvaratskhelia (7), Barcola (29), et les recrues estivales venues renforcer le groupe de Luis Enrique.`,
    metaTitle: "Maillot PSG 2025-2026 — Nike, Domicile, Extérieur, Third, Fourth",
    metaDesc:
      "Maillot PSG 2025-2026 par Nike : domicile inspiré des monuments parisiens, extérieur, third et fourth Jordan. Floquage Mbappé, Dembélé, Hakimi, Donnarumma.",
  },
  {
    slug: "2024-2025",
    label: "2024-2025",
    era: "recente",
    shirtMaker: "Nike",
    position: 2,
    description: `La saison 2024-2025 restera dans l'histoire : le PSG remporte sa première Ligue des champions face à l'Inter Milan en finale (5-0 à Munich), ainsi que la Ligue 1 et la Coupe de France. Le maillot domicile 2024-2025 reprend la silhouette du panneau central historique, en bleu marine, blanc et rouge, avec un col rouge.

Le maillot extérieur 2024-2025, blanc avec bande verticale rouge, fait partie des plus appréciés des supporters. Le third Nike, en gris ardoise, ajoute une touche premium. La saison voit la consécration d'Ousmane Dembélé, ballon d'or 2025, et la confirmation de la jeune génération avec Désiré Doué, Bradley Barcola et João Neves.`,
    metaTitle: "Maillot PSG 2024-2025 — Saison du Triplé historique",
    metaDesc:
      "Maillot PSG 2024-2025 : domicile, extérieur, third Nike. La saison historique de la première Ligue des champions parisienne.",
  },
  {
    slug: "2023-2024",
    label: "2023-2024",
    era: "recente",
    shirtMaker: "Nike",
    position: 3,
    description: `La saison 2023-2024 marque la deuxième année de Luis Enrique sur le banc et le départ de Kylian Mbappé en fin de saison. Le maillot domicile reprend la coupe panneau central avec un coloris bleu nuit profond et le célèbre liseré rouge et blanc verticaux. Le maillot extérieur "Eiffel" est devenu instantanément culte avec son fond beige et son motif tour Eiffel répété.

Effectif emblématique : Mbappé (7), Dembélé (10) — sa première saison à Paris —, Hakimi (2), Marquinhos (5), Donnarumma (1), Vitinha (17). Le PSG remporte la Ligue 1 et la Coupe de France, mais s'incline face à Dortmund en demi-finale de Champions League.`,
    metaTitle: "Maillot PSG 2023-2024 — Mbappé, Dembélé, dernière saison",
    metaDesc:
      "Maillot PSG 2023-2024 : la saison du maillot extérieur Eiffel et de la dernière année de Mbappé à Paris.",
  },
  {
    slug: "retro-2001-2002",
    label: "2001-2002",
    era: "retro",
    shirtMaker: "Nike",
    position: 10,
    description: `La saison 2001-2002 est entrée dans la légende du PSG : c'est l'année de l'arrivée de Ronaldinho à Paris, recruté à 21 ans depuis Grêmio. Lors de sa première saison, il porte le numéro 21 (Jay-Jay Okocha détient alors le numéro 10) et fait ses débuts en match officiel le 4 août 2001 face à Auxerre. Le maillot domicile, fourni par Nike avec le sponsor Opel, est resté dans les mémoires comme l'une des plus belles tuniques parisiennes des années 2000.

Le maillot rétro 2001-2002 a été réédité en édition limitée et reste l'une des pièces les plus recherchées par les collectionneurs. Disponible en floquage Ronaldinho 21, Anelka, Okocha, Distin, Pochettino.`,
    metaTitle: "Maillot PSG 2001-2002 Rétro — Ronaldinho saison 1",
    metaDesc:
      "Le maillot rétro PSG 2001-2002, première saison de Ronaldinho à Paris (n°21). Édition collector Nike Opel.",
  },
  {
    slug: "retro-2012-2014",
    label: "2012-2014 (ère Ibrahimović)",
    era: "retro",
    shirtMaker: "Nike",
    position: 11,
    description: `L'ère Zlatan Ibrahimović démarre à l'été 2012 avec le rachat du PSG par Qatar Sports Investments. Le maillot domicile 2012-2013, premier sous l'ère QSI, est sobre, élégant, bleu marine, avec le sponsor Emirates qui rejoint le club. La saison suivante, 2013-2014, voit l'arrivée éphémère de David Beckham (n°32) et la consécration d'Ibrahimović qui marque 41 buts en championnat.

Pièces collector incontournables : maillot Zlatan 10 PSG, maillot Beckham 32 PSG (édition spéciale 5 mois de carrière à Paris), Cavani 9, Lavezzi 22, Pastore 27, Thiago Silva 2.`,
    metaTitle: "Maillot PSG 2012-2014 — Ibrahimović, Beckham, ère QSI",
    metaDesc:
      "Maillot rétro PSG 2012-2014 : ère Ibrahimović, Beckham, début QSI. Pièces collector authentiques.",
  },
];

// ───── Joueurs ─────
const players = [
  // Effectif actuel 2025-2026
  {
    slug: "donnarumma",
    name: "Gianluigi Donnarumma",
    firstName: "Gianluigi",
    lastName: "Donnarumma",
    number: 1,
    position: "Gardien de but",
    nationality: "Italie",
    era: "actuel",
    position2: 1,
    bio: `Gianluigi Donnarumma, surnommé "Gigio", est le gardien de but du Paris Saint-Germain depuis 2021. Champion d'Europe avec l'Italie en 2021 (élu meilleur joueur de l'Euro), il a porté le PSG vers son premier sacre en Ligue des champions en 2025 avec une finale d'anthologie face à l'Inter Milan. Reconnu pour sa taille (1m96), ses réflexes exceptionnels et sa sérénité dans les grands rendez-vous, Donnarumma est aujourd'hui considéré comme l'un des trois meilleurs gardiens du monde.

Le maillot Donnarumma 1 du PSG est l'un des plus demandés au rayon gardien. Coupe portier, coloris distinctifs (vert fluo, noir, rose selon les saisons), souvent en option manches longues. Disponible en tailles adulte XS à 3XL et enfant 4 à 16 ans.`,
  },
  {
    slug: "hakimi",
    name: "Achraf Hakimi",
    firstName: "Achraf",
    lastName: "Hakimi",
    number: 2,
    position: "Défenseur latéral droit",
    nationality: "Maroc",
    era: "actuel",
    position2: 2,
    bio: `Achraf Hakimi, latéral droit marocain, est arrivé au PSG à l'été 2021 en provenance de l'Inter Milan. Vice-champion d'Afrique avec le Maroc en 2024, demi-finaliste historique de la Coupe du monde 2022 face à la France, Hakimi est l'un des défenseurs les plus complets de sa génération. Sa puissance, sa vitesse et ses qualités offensives en font un joueur clé du système de Luis Enrique.

Le maillot Hakimi 2 du PSG est très populaire au Maroc, en France et dans toute l'Afrique. Floquable en domicile, extérieur, third, et toutes les déclinaisons enfant.`,
  },
  {
    slug: "marquinhos",
    name: "Marquinhos",
    firstName: "Marcos",
    lastName: "Marquinhos",
    number: 5,
    position: "Défenseur central",
    nationality: "Brésil",
    era: "actuel",
    position2: 3,
    bio: `Marcos Aoás Corrêa, dit Marquinhos, est le capitaine emblématique du PSG. Défenseur central brésilien arrivé en 2013 depuis l'AS Roma, il porte le brassard depuis 2020 et a soulevé la première Coupe d'Europe du club en 2025. Avec plus de 500 matchs joués sous le maillot parisien, il est l'un des joueurs les plus capés de l'histoire du club et une référence du poste de défenseur central.

Le maillot Marquinhos 5 est un classique pour les supporters fidèles du PSG. Disponible en toutes les saisons et toutes les tailles avec floquage personnalisé.`,
  },
  {
    slug: "kvaratskhelia",
    name: "Khvicha Kvaratskhelia",
    firstName: "Khvicha",
    lastName: "Kvaratskhelia",
    number: 7,
    position: "Ailier gauche",
    nationality: "Géorgie",
    era: "actuel",
    position2: 4,
    bio: `Khvicha Kvaratskhelia, surnommé "Kvaradona" par les supporters napolitains, a rejoint le PSG en janvier 2025 depuis Naples, où il avait remporté le Scudetto en 2023. Capitaine de la sélection géorgienne, il est l'un des ailiers les plus créatifs et techniques du football mondial. Sa capacité à dribbler en un contre un et sa frappe de balle déjà légendaire font de lui un favori des amateurs de beau jeu.

Le maillot Kvaratskhelia 7 du PSG est devenu instantanément populaire. Floquable en typographie officielle Ligue 1 et UEFA Champions League.`,
  },
  {
    slug: "fabian-ruiz",
    name: "Fabián Ruiz",
    firstName: "Fabián",
    lastName: "Ruiz",
    number: 8,
    position: "Milieu central",
    nationality: "Espagne",
    era: "actuel",
    position2: 5,
    bio: `Fabián Ruiz Peña, milieu central espagnol, a rejoint le PSG en 2022 depuis Naples. Champion d'Europe avec l'Espagne en 2024 (élu meilleur joueur de l'Euro), il est l'un des milieux les plus techniques de Ligue 1. Sa précision dans la passe, sa vista et sa frappe lointaine en font un élément clé du système de Luis Enrique.

Le maillot Fabián Ruiz 8 séduit les amateurs du jeu de possession à l'espagnole.`,
  },
  {
    slug: "dembele",
    name: "Ousmane Dembélé",
    firstName: "Ousmane",
    lastName: "Dembélé",
    number: 10,
    position: "Attaquant",
    nationality: "France",
    era: "actuel",
    position2: 6,
    bio: `Ousmane Dembélé, surnommé "Mosquito", est l'attaquant phare du Paris Saint-Germain depuis l'été 2023. Ballon d'Or 2025 après une saison historique (35 buts, premier titre en Ligue des champions, triplé national), il est passé du statut de talent au sommet du football mondial. International français champion du monde 2018, son explosivité, sa technique et sa polyvalence offensive en font un joueur unique.

Le maillot Dembélé 10 du PSG est l'un des plus vendus au monde depuis son sacre individuel. Floquage "DEMBELE 10" disponible en typographie officielle Ligue 1 et UEFA Champions League, sur tous les modèles domicile, extérieur, third, fourth et déclinaisons enfant.`,
  },
  {
    slug: "doue",
    name: "Désiré Doué",
    firstName: "Désiré",
    lastName: "Doué",
    number: 14,
    position: "Milieu offensif",
    nationality: "France",
    era: "actuel",
    position2: 7,
    bio: `Désiré Doué, jeune prodige formé au Stade Rennais, a rejoint le PSG à l'été 2024. Auteur d'une finale de Ligue des champions exceptionnelle en 2025 (un but, deux passes décisives), il s'est imposé à 19 ans comme l'un des grands espoirs du football mondial. International français, milieu offensif gaucher polyvalent, il symbolise le pari du club sur la jeunesse.

Le maillot Doué 14 du PSG est très populaire chez les jeunes supporters. Floquable sur toutes les déclinaisons adulte et enfant.`,
  },
  {
    slug: "vitinha",
    name: "Vitinha",
    firstName: "Vítor",
    lastName: "Vitinha",
    number: 17,
    position: "Milieu central",
    nationality: "Portugal",
    era: "actuel",
    position2: 8,
    bio: `Vítor Machado Ferreira, dit Vitinha, est le métronome du milieu parisien. Arrivé en 2022 depuis le FC Porto, il a progressivement pris le rôle de chef d'orchestre du PSG sous Luis Enrique. International portugais, son intelligence de jeu, sa capacité à se créer de l'espace et sa précision dans la passe en font l'un des meilleurs milieux d'Europe.

Le maillot Vitinha 17 est apprécié des connaisseurs du jeu collectif et des fans portugais.`,
  },
  {
    slug: "barcola",
    name: "Bradley Barcola",
    firstName: "Bradley",
    lastName: "Barcola",
    number: 29,
    position: "Ailier gauche",
    nationality: "France",
    era: "actuel",
    position2: 9,
    bio: `Bradley Barcola, ailier gauche international français, a rejoint le PSG à l'été 2023 en provenance de l'Olympique Lyonnais. Sa vitesse pure, ses appels en profondeur et son sang-froid devant le but ont rapidement fait de lui un titulaire indiscutable. À 22 ans, il enchaîne les saisons à 20 buts ou plus toutes compétitions confondues.

Le maillot Barcola 29 du PSG est très demandé chez les supporters parisiens et lyonnais convertis à la cause rouge et bleue.`,
  },
  {
    slug: "joao-neves",
    name: "João Neves",
    firstName: "João",
    lastName: "Neves",
    number: 87,
    position: "Milieu défensif",
    nationality: "Portugal",
    era: "actuel",
    position2: 10,
    bio: `João Pedro Gonçalves Neves, dit João Neves, milieu défensif international portugais, a rejoint le PSG à l'été 2024 depuis Benfica. Malgré sa petite taille (1m74), son agressivité, sa lecture du jeu et sa technique en font un sentinelle moderne très complet. Compagnon idéal de Vitinha au milieu, il symbolise l'école portugaise en plein essor.

Le maillot João Neves 87 du PSG est apprécié des amateurs de milieu créatif.`,
  },
  // Légendes
  {
    slug: "mbappe",
    name: "Kylian Mbappé",
    firstName: "Kylian",
    lastName: "Mbappé",
    number: 7,
    position: "Attaquant",
    nationality: "France",
    era: "legende",
    position2: 50,
    bio: `Kylian Mbappé est l'une des plus grandes légendes récentes du Paris Saint-Germain. Arrivé en 2017 depuis l'AS Monaco, il a marqué 256 buts en 308 matchs sous le maillot parisien avant de rejoindre le Real Madrid à l'été 2024. Champion du monde 2018 avec la France, finaliste 2022 (triplé en finale), Mbappé reste un favori absolu des supporters parisiens. Le maillot PSG Mbappé 7 saisons 2017 à 2024 est l'un des plus collectionnés au monde.

Notre catalogue propose les maillots PSG floqués Mbappé sur l'ensemble de ses saisons parisiennes : 2017-2018 (saison du sacre Ligue 1), 2018-2019, 2019-2020 (finale UCL), 2020-2021, 2021-2022, 2022-2023, 2023-2024.`,
  },
  {
    slug: "neymar",
    name: "Neymar Jr",
    firstName: "Neymar",
    lastName: "Neymar",
    number: 10,
    position: "Attaquant",
    nationality: "Brésil",
    era: "legende",
    position2: 51,
    bio: `Neymar da Silva Santos Júnior a rejoint le PSG en août 2017 pour un transfert record de 222 millions d'euros depuis le FC Barcelone. Au-delà de la dimension sportive, Neymar a contribué à donner au PSG une stature mondiale. Avec 118 buts en 173 matchs sous le maillot parisien, il a remporté de nombreux titres nationaux et a porté le PSG en finale de Ligue des champions 2020.

Le maillot Neymar 10 du PSG, surtout celui de la saison 2017-2018 (première saison) et 2019-2020 (finale Champions League), est une pièce de collection ultra recherchée.`,
  },
  {
    slug: "ibrahimovic",
    name: "Zlatan Ibrahimović",
    firstName: "Zlatan",
    lastName: "Ibrahimović",
    number: 10,
    position: "Attaquant",
    nationality: "Suède",
    era: "legende",
    position2: 52,
    bio: `Zlatan Ibrahimović, légende suédoise, a porté le maillot du PSG de 2012 à 2016. Recruté pour donner une dimension internationale au projet QSI, il a marqué 156 buts en 180 matchs et a remporté quatre titres de champion de France consécutifs. Sa personnalité, ses déclarations cultes et ses gestes techniques inégalés ont marqué une génération entière de supporters parisiens.

Le maillot Zlatan Ibrahimović 10 PSG est l'une des références absolues du rayon rétro. Disponible sur les saisons 2012-2013, 2013-2014, 2014-2015, 2015-2016.`,
  },
  {
    slug: "ronaldinho",
    name: "Ronaldinho",
    firstName: "Ronaldo",
    lastName: "Ronaldinho",
    number: 21,
    position: "Milieu offensif",
    nationality: "Brésil",
    era: "legende",
    position2: 53,
    bio: `Ronaldinho Gaúcho, double Ballon d'Or, a porté le maillot du PSG de 2001 à 2003. Sa première saison parisienne (2001-2002) en tant que numéro 21 (Jay-Jay Okocha détenait le n°10) reste mythique dans l'imaginaire collectif. C'est à Paris que Ronaldinho a explosé avant de rejoindre le FC Barcelone et de devenir l'icône mondiale qu'on connaît.

Le maillot rétro Ronaldinho PSG 2001-2002 et 2002-2003 a été réédité en plusieurs occasions et reste l'un des items les plus demandés. Disponible en floquage Ronaldinho 21 (saison 1) et Ronaldinho 10 (saison 2).`,
  },
  {
    slug: "beckham",
    name: "David Beckham",
    firstName: "David",
    lastName: "Beckham",
    number: 32,
    position: "Milieu",
    nationality: "Angleterre",
    era: "legende",
    position2: 54,
    bio: `David Beckham, icône mondiale du football, a rejoint le PSG en janvier 2013 pour les six derniers mois de sa carrière. À 37 ans, il a porté le numéro 32 (son âge à l'arrivée) et a contribué au titre de Ligue 1 2012-2013, le premier de l'ère QSI. Sa présence médiatique a propulsé l'image internationale du club. Beckham reverse l'intégralité de son salaire à une association caritative parisienne.

Le maillot Beckham 32 PSG saison 2012-2013 est une pièce collector hors du commun.`,
  },
  {
    slug: "pauleta",
    name: "Pauleta",
    firstName: "Pedro",
    lastName: "Pauleta",
    number: 9,
    position: "Attaquant",
    nationality: "Portugal",
    era: "legende",
    position2: 55,
    bio: `Pedro Miguel Carreiro Resendes, dit Pauleta, attaquant portugais, est l'un des meilleurs buteurs de l'histoire du PSG avec 109 buts entre 2003 et 2008. Surnommé "l'Aigle des Açores", il a marqué une génération de supporters parisiens et reste une référence pour les fans des années 2000. Capitaine du club, il a porté Paris dans une période difficile avant l'ère QSI.

Le maillot Pauleta 9 PSG est très recherché des collectionneurs.`,
  },
];

// ───── Guides ─────
const guides = [
  {
    slug: "comment-choisir-taille-maillot-psg",
    title: "Comment choisir la taille de son maillot PSG : guide complet",
    excerpt:
      "Tableau des tailles adulte S à 3XL et enfant 2 à 13 ans, conseils pour bien choisir entre coupe replica et coupe authentique du PSG.",
    metaTitle: "Taille maillot PSG : guide adulte et enfant 2026",
    metaDesc:
      "Bien choisir la taille de son maillot PSG : tableau adulte S-3XL, enfant 2-13 ans, différences replica/authentique. Échange gratuit chez Maillot-PSG.",
    keywords: "taille maillot psg, guide taille maillot foot, maillot psg enfant taille",
    content: `<p>Choisir la bonne taille pour son maillot du Paris Saint-Germain n'est pas toujours évident, surtout entre les coupes replica (la plus courante) et authentique (Match Player Issue), ou pour les tailles enfant. Ce guide résume tout ce qu'il faut savoir avant de commander.</p>

<h2>Tableau des tailles adulte (replica)</h2>
<p>La coupe replica est celle vendue dans le commerce pour les supporters. Elle est légèrement plus ample que la coupe authentique portée par les joueurs.</p>
<ul>
<li><strong>XS</strong> : tour de poitrine 86-91 cm — équivalent 36/38 français</li>
<li><strong>S</strong> : 91-97 cm — 38/40</li>
<li><strong>M</strong> : 97-102 cm — 40/42 (taille la plus vendue)</li>
<li><strong>L</strong> : 102-107 cm — 42/44</li>
<li><strong>XL</strong> : 107-112 cm — 44/46</li>
<li><strong>XXL</strong> : 112-119 cm — 46/48</li>
<li><strong>3XL</strong> : 119-127 cm — 48/50</li>
</ul>

<h2>Tableau des tailles enfant</h2>
<p>Les tailles enfant vont de 2 à 13 ans chez Maillot-PSG. Si vous hésitez entre deux tailles, prenez la plus grande : votre enfant grandit vite et le maillot restera portable une saison de plus.</p>
<ul>
<li><strong>2-3 ans</strong> : 86-98 cm</li>
<li><strong>4-5 ans</strong> : 98-110 cm</li>
<li><strong>6-7 ans</strong> : 110-122 cm</li>
<li><strong>8-9 ans</strong> : 122-134 cm</li>
<li><strong>10-11 ans</strong> : 134-146 cm</li>
<li><strong>12-13 ans</strong> : 146-158 cm</li>
</ul>

<h2>Replica vs Authentique : quelle différence ?</h2>
<p>Le <strong>maillot replica</strong> (aussi appelé <em>Stadium</em> chez Nike) est destiné aux supporters. Coupe légèrement ample, tissu polyester recyclé Dri-FIT, écusson et logo brodés ou imprimés selon les saisons. C'est la version la plus vendue, à un prix accessible (89,90 € en moyenne).</p>
<p>Le <strong>maillot authentique</strong> (<em>Match Player Issue</em> ou <em>Vapor Match</em>) est strictement identique à celui porté par les joueurs en match. Coupe ajustée, tissu plus léger et plus respirant (technologie Dri-FIT ADV), écusson cousu/embossé, ventilation accrue. Comptez 130 à 150 € selon les saisons. Si vous portez habituellement du M en t-shirt, prenez du M en authentique. Si vous voulez de l'aisance, prenez une taille au-dessus.</p>

<h2>Comment mesurer ?</h2>
<p>Mesurez le tour de poitrine au plus large, sous les aisselles, avec un mètre ruban. Restez détendu, ne tendez pas le ruban.</p>

<h2>Échange de taille gratuit</h2>
<p>Sur Maillot-PSG, l'échange de taille est gratuit dans les 14 jours après réception, hors floquage personnalisé. Si le maillot est trop petit ou trop grand, contactez-nous : on s'occupe de tout.</p>`,
  },
  {
    slug: "floquage-maillot-psg",
    title: "Floquage maillot PSG : guide complet du flocage personnalisé",
    excerpt:
      "Tout savoir sur le floquage des maillots PSG : typographie officielle Ligue 1 vs Champions League, joueurs phares, prix, durabilité.",
    metaTitle: "Floquage maillot PSG : prix, joueurs, typographie 2026",
    metaDesc:
      "Floquer son maillot du PSG au nom d'un joueur ou personnalisé : prix, typo Ligue 1 et UEFA Champions League, durabilité, conseils.",
    keywords: "flocage maillot psg, floquage psg, maillot psg personnalisé",
    content: `<p>Le floquage est l'élément qui rend votre maillot PSG vraiment unique. Au nom d'un joueur de l'effectif, d'une légende du club ou avec votre propre nom, c'est l'option la plus prisée par les supporters parisiens.</p>

<h2>Quelle typographie pour mon maillot PSG ?</h2>
<p>La typographie change selon la compétition :</p>
<ul>
<li><strong>Ligue 1</strong> : typographie officielle de la Ligue de Football Professionnel, mise à jour chaque saison. Lettres et chiffres dans le coloris du club (blanc ou rouge selon les maillots).</li>
<li><strong>UEFA Champions League</strong> : typographie spécifique européenne, identique pour tous les clubs participant à la C1, généralement plus stylisée.</li>
<li><strong>Coupe de France</strong> : typo générique LFP.</li>
</ul>
<p>Précisez votre choix au moment de la commande. Par défaut, nous appliquons la typographie Ligue 1 de la saison du maillot.</p>

<h2>Quels joueurs floquer ?</h2>
<p>Sur l'effectif 2025-2026, les floquages les plus demandés sont : <strong>Dembélé 10</strong> (ballon d'or 2025), <strong>Donnarumma 1</strong> (héros de la finale UCL), <strong>Hakimi 2</strong>, <strong>Marquinhos 5</strong> (capitaine), <strong>Kvaratskhelia 7</strong>, <strong>Vitinha 17</strong>, <strong>Doué 14</strong>, <strong>Barcola 29</strong>, <strong>João Neves 87</strong>.</p>
<p>Pour les maillots rétro, les classiques : <strong>Mbappé 7</strong>, <strong>Neymar 10</strong>, <strong>Ibrahimović 10</strong>, <strong>Ronaldinho 10</strong> ou <strong>21</strong>, <strong>Cavani 9</strong>, <strong>Pauleta 9</strong>, <strong>Beckham 32</strong>, <strong>Pastore 27</strong>, <strong>Thiago Silva 2</strong>.</p>

<h2>Combien coûte un floquage ?</h2>
<p>Le floquage est facturé 5 € chez Maillot-PSG, incluant nom et numéro avec la typographie officielle. C'est l'un des prix les plus bas du marché — la plupart des concurrents pratiquent entre 15 et 25 €.</p>

<h2>Le floquage est-il durable ?</h2>
<p>Nous utilisons la technique du flocage thermocollé : le motif est appliqué à chaud sous pression sur le tissu. Avec un entretien correct (lavage à 30°C envers, pas de sèche-linge, repassage envers), le floquage tient 100+ lavages sans craqueler.</p>

<h2>Peut-on retourner un maillot floqué ?</h2>
<p>Le maillot floqué personnalisé n'est pas reprenable, sauf défaut produit (loi sur le droit de rétractation pour les biens personnalisés). Vérifiez bien le nom et le numéro avant de valider la commande.</p>`,
  },
  {
    slug: "maillot-psg-authentique-vs-replica",
    title: "Maillot PSG authentique vs replica : 6 différences à connaître",
    excerpt:
      "Match Player Issue ou Stadium replica : coupe, tissu, finitions, prix, écussons. Tout pour choisir entre les deux versions.",
    metaTitle: "Maillot PSG authentique vs replica : différences 2026",
    metaDesc:
      "Différences entre maillot PSG authentique (Match Player Issue) et replica (Stadium) : coupe, tissu, prix, écusson. Comment choisir.",
    keywords: "maillot psg authentique, maillot psg replica, match player issue, stadium psg",
    content: `<p>Si vous regardez le rayon maillot du PSG, vous verrez deux versions : la <strong>replica (Stadium)</strong> et l'<strong>authentique (Match Player Issue ou Vapor Match)</strong>. Voici les six différences qui comptent vraiment.</p>

<h2>1. La coupe</h2>
<p>La replica a une coupe ample, classique pour un t-shirt. L'authentique est ajustée près du corps : c'est exactement le maillot que portent les joueurs en match, pensé pour la performance, pas pour le confort lifestyle.</p>

<h2>2. Le tissu</h2>
<p>Replica : polyester recyclé Dri-FIT standard.<br>
Authentique : Dri-FIT ADV, tissu plus léger (environ 30 % moins lourd), zones de ventilation plus larges, technologie Vaporknit qui améliore l'évacuation de la transpiration. Sensiblement plus respirant.</p>

<h2>3. L'écusson</h2>
<p>Replica : écusson PSG transferé/imprimé, parfois brodé selon les années.<br>
Authentique : écusson cousu et embossé, en relief, finition premium.</p>

<h2>4. Le sponsor et le logo Nike</h2>
<p>Replica : sponsor (Qatar Airways) et swoosh Nike imprimés.<br>
Authentique : sponsor en relief siliconé, logo Nike thermocollé haute densité.</p>

<h2>5. Le prix</h2>
<p>Replica : 89,90 € en moyenne (PSG 2025-2026).<br>
Authentique : 130 à 150 €.</p>

<h2>6. La disponibilité du floquage</h2>
<p>Sur replica, vous floquez librement avec n'importe quel nom/numéro. Sur authentique, certains revendeurs n'autorisent que les flocages officiels (joueurs de l'effectif). Chez Maillot-PSG, vous floquez librement quel que soit le modèle.</p>

<h2>Lequel choisir ?</h2>
<p>Pour porter au quotidien, encourager le PSG en tribunes ou faire un cadeau à un enfant : la replica est largement suffisante. Pour les puristes, les passionnés ou si vous jouez au foot avec : l'authentique offre une expérience supérieure.</p>`,
  },
  {
    slug: "maillots-psg-iconiques",
    title: "Top 10 des maillots PSG iconiques de l'histoire du club",
    excerpt:
      "De Daniel Hechter à Jordan x PSG, les dix maillots qui ont marqué le Paris Saint-Germain depuis 1970.",
    metaTitle: "Top 10 maillots PSG iconiques : Hechter, Ronaldinho, Jordan",
    metaDesc:
      "Les 10 maillots les plus iconiques de l'histoire du PSG : Daniel Hechter, Ouest Foire, Ronaldinho, Ibrahimović, Jordan, Mbappé.",
    keywords: "maillot psg iconique, maillot psg historique, maillot psg Hechter, maillot psg Jordan",
    content: `<p>Depuis sa fondation en 1970, le Paris Saint-Germain a porté des dizaines de maillots. Voici les dix qui ont marqué l'histoire et l'imaginaire des supporters.</p>

<h2>1. Maillot Daniel Hechter 1973-1974</h2>
<p>Le maillot fondateur. Daniel Hechter, alors président du club, dessine en 1973 le maillot bleu marine avec la bande verticale rouge bordée de blanc. C'est le code visuel qui définit encore le PSG aujourd'hui.</p>

<h2>2. Maillot Ouest Foire 1976-1985</h2>
<p>Le sponsor qui a accompagné le PSG durant ses premières années en première division. Le maillot blanc à bandes rouges et bleues d'Ouest Foire est ultra recherché des collectionneurs.</p>

<h2>3. Maillot Tomy 1989-1991</h2>
<p>Sponsor japonais, design coloré typique des années 90. Pièce culte pour les amateurs de l'époque pré-Canal+.</p>

<h2>4. Maillot Müller 1993-1995</h2>
<p>Le maillot de la grande équipe Bernard Lama, Paul Le Guen, David Ginola, George Weah, Raí — celle qui atteint la demi-finale de Coupe d'Europe 1995.</p>

<h2>5. Maillot Opel domicile 2001-2002</h2>
<p>Le maillot de la première saison de Ronaldinho. Bleu marine, bande centrale blanche, sponsor Opel. Réédité en édition collector.</p>

<h2>6. Maillot Fly Emirates 2008-2009</h2>
<p>Premier maillot à fond noir/bleu nuit avec liseré rouge, sponsor Emirates. Marque le début d'une nouvelle ère graphique.</p>

<h2>7. Maillot 2012-2013 Ibrahimović</h2>
<p>Le maillot de l'ère QSI naissante. Sobre, élégant, premier titre de champion de France après 19 ans d'attente.</p>

<h2>8. Maillot Jordan x PSG 2018-2019</h2>
<p>Première collaboration mondiale entre un club et la marque Jordan. Maillot noir avec logos Jumpman dorés. Vendu en quelques heures, devenu pièce ultra collector.</p>

<h2>9. Maillot domicile 2017-2018 Mbappé/Neymar</h2>
<p>Saison du recrutement record Neymar (222 M€) et Mbappé (180 M€). Le maillot bleu nuit avec sa bande centrale blanche est associé à l'avènement du PSG comme superpuissance mondiale.</p>

<h2>10. Maillot domicile 2024-2025 — Triplé historique</h2>
<p>Le maillot du sacre. Première Ligue des champions parisienne face à l'Inter Milan, Ligue 1, Coupe de France. Étoile dorée ajoutée sur la version 2025-2026 pour célébrer le triplé.</p>`,
  },
  {
    slug: "maillot-psg-jordan-collaboration",
    title: "Jordan x PSG : l'histoire d'une collaboration culte",
    excerpt:
      "Depuis 2018, Jordan signe les maillots third et fourth du PSG. Retour sur sept saisons de collaboration entre le club parisien et la marque au Jumpman.",
    metaTitle: "Jordan x PSG : tous les maillots de la collaboration",
    metaDesc:
      "Histoire complète de la collaboration Jordan x PSG depuis 2018 : tous les maillots third et fourth, designs cultes, éditions limitées.",
    keywords: "psg jordan, maillot jordan psg, collab jordan paris, fourth psg jordan",
    content: `<p>En septembre 2018, le Paris Saint-Germain et la marque Jordan annoncent un partenariat sans précédent : pour la première fois, la marque au Jumpman habille un club de football. Retour sur sept saisons de collaboration culte.</p>

<h2>2018-2019 : le maillot fondateur</h2>
<p>Maillot noir, logos Jumpman dorés, sponsor Accor — la première sortie est un coup de tonnerre. Vendu en quelques heures sur la planète entière, le maillot devient instantanément culte. Le PSG le porte en Ligue des champions, ce qui crée une rupture visuelle majeure dans l'univers du foot.</p>

<h2>2019-2020 : la confirmation</h2>
<p>Maillot blanc, finition oversize. La saison se termine en finale de Ligue des champions face au Bayern Munich (0-1). Mbappé, Neymar, Di María portent le Jordan en Champions League jusqu'à la finale.</p>

<h2>2020-2021 : le rose</h2>
<p>Pour la première fois, Jordan x PSG ose le rose poudré associé au noir. Pièce signature de la collaboration, devenue lifestyle bien au-delà des supporters parisiens.</p>

<h2>2022-2023 : le retour aux origines</h2>
<p>Maillot rouge avec logos Jumpman noirs. Look streetwear assumé, très porté hors stade.</p>

<h2>2024-2025 : la victoire</h2>
<p>Maillot Jordan beige sablé porté lors du parcours de Ligue des champions. Symbole du triplé historique remporté en 2025.</p>

<h2>2025-2026 : le fourth kit rouge</h2>
<p>Pour célébrer la victoire en Ligue des champions, Jordan x PSG sort un quatrième maillot rouge éclatant avec étoile dorée commémorative. Floquable Dembélé, Donnarumma, Hakimi.</p>

<h2>Ces pièces deviennent collector</h2>
<p>Tous les maillots Jordan x PSG sont produits en quantités limitées. Les pièces les plus anciennes (2018-2019, 2019-2020) atteignent aujourd'hui 300 à 600 € sur le marché secondaire en très bon état. Si vous tenez à votre maillot Jordan PSG, gardez-le précieusement — il prendra de la valeur.</p>`,
  },
  {
    slug: "comment-laver-maillot-psg-floquage",
    title: "Comment laver un maillot PSG sans abîmer le floquage",
    excerpt:
      "Méthode complète pour laver et entretenir votre maillot du Paris Saint-Germain : température, lessive, séchage, repassage. Préservez le flocage 100+ lavages.",
    metaTitle: "Comment laver un maillot PSG : guide entretien et floquage",
    metaDesc:
      "Tout savoir pour laver son maillot PSG sans abîmer le floquage : température, programme machine, lessive, séchage. 8 conseils pour qu'il dure des années.",
    keywords: "laver maillot psg, entretien maillot foot, comment laver flocage maillot psg",
    content: `<p>Un maillot PSG bien entretenu peut durer 10 ans et plus de 100 lavages sans perdre son éclat. Mal lavé, le floquage craque dès la 5<sup>e</sup> machine. Voici la méthode complète pour préserver votre maillot du Paris Saint-Germain, qu'il soit replica ou authentique, floqué ou non.</p>

<h2>Avant le premier lavage : la bonne préparation</h2>
<p>Retournez systématiquement le maillot avant de le mettre en machine. C'est la règle d'or qui protège à la fois le <strong>floquage</strong> (nom, numéro), l'<strong>écusson</strong>, le sponsor et le logo Nike. Le tissu intérieur subit le frottement du tambour, pas la face décorative.</p>
<p>Fermez les fermetures éclair éventuelles, enlevez les boutons de col et utilisez un filet de lavage si vous en avez un — surtout pour les maillots authentiques au tissu Vaporknit fragile.</p>

<h2>Programme machine : 30°C grand maximum</h2>
<p>La température est le paramètre n°1 qui détermine la durée de vie du floquage. Au-dessus de 40°C, la colle thermocollée des lettres et chiffres se ramollit progressivement et finit par se décoller au bout de quelques cycles.</p>
<ul>
<li><strong>Température</strong> : 30°C, jamais plus</li>
<li><strong>Programme</strong> : synthétique ou délicat</li>
<li><strong>Essorage</strong> : 800 tours/min maximum</li>
<li><strong>Mode rapide / express</strong> : à éviter (frottement plus violent du tambour)</li>
</ul>

<h2>Quelle lessive utiliser ?</h2>
<p>Une lessive liquide douce, sans javel ni agents blanchissants. Les <strong>lessives en poudre agressives</strong> et la <strong>javel</strong> attaquent les fibres polyester du Dri-FIT et ternissent les couleurs. Évitez aussi l'adoucissant : il bouche les pores du tissu et réduit la respirabilité du maillot, ce qui est dommage sur un Dri-FIT prévu pour évacuer la transpiration.</p>

<h2>Séchage : jamais au sèche-linge</h2>
<p>C'est l'erreur fatale n°2. Le sèche-linge cumule chaleur et brassage mécanique : le floquage se décolle et le tissu se déforme. Séchez votre maillot à l'air libre, à plat sur un étendoir si possible (sinon sur un cintre, mais évitez les épaules pointues qui marquent le tissu).</p>
<p>Pas de séchage en plein soleil non plus : les UV décolorent les rouges et les bleus. À l'ombre, dans un endroit ventilé, le maillot sèche en quelques heures.</p>

<h2>Repassage : sur l'envers, à basse température</h2>
<p>Si vraiment nécessaire, repassez votre maillot retourné, à 110°C maximum (programme synthétique), <strong>sans jamais passer le fer sur le floquage ni sur l'écusson</strong>. Le mieux reste de ne pas repasser : un maillot bien étendu après lavage ne se froisse quasiment pas.</p>

<h2>Cas particulier : le maillot authentique</h2>
<p>Le maillot authentique (Match Player Issue, Vaporknit) est encore plus fragile. Préférez un lavage à la main à 30°C avec une lessive très douce, ou un programme laine en machine, dans un filet. Pas d'essorage automatique — pressez doucement entre deux serviettes pour évacuer l'eau, puis séchez à plat.</p>

<h2>Que faire si le floquage commence à se décoller ?</h2>
<p>Si un coin de lettre ou de numéro commence à se soulever, n'attendez pas : passez un fer chaud (programme synthétique, 110°C) sur la zone décollée, à travers une feuille de papier sulfurisé ou un tissu fin. La colle thermocollée se réactive et la lettre se recolle. Pressez 10 secondes sans bouger, laissez refroidir 1 minute.</p>

<h2>Récap : les 8 règles d'or</h2>
<ul>
<li>Toujours retourner avant lavage</li>
<li>30°C maximum</li>
<li>Programme délicat ou synthétique</li>
<li>Lessive liquide douce, pas d'adoucissant ni de javel</li>
<li>Essorage 800 tours max</li>
<li>Pas de sèche-linge — séchage à plat à l'ombre</li>
<li>Pas de repassage direct sur le floquage</li>
<li>Recoller au fer si une lettre se soulève</li>
</ul>
<p>Avec ces règles, votre maillot du PSG <a href="/maillots">domicile</a>, <a href="/maillots/exterieur">extérieur</a> ou <a href="/maillots/third">third</a> tiendra plusieurs saisons sans broncher, floquage compris.</p>`,
  },
  {
    slug: "prix-maillot-psg-2026",
    title: "Combien coûte un maillot PSG en 2026 ? Prix replica, authentique, rétro",
    excerpt:
      "Tous les prix des maillots du Paris Saint-Germain en 2026 : replica, authentique, enfant, rétro, training. Comparatif des tarifs et conseils pour économiser.",
    metaTitle: "Prix maillot PSG 2026 : combien ça coûte vraiment ?",
    metaDesc:
      "Prix d'un maillot PSG en 2026 : replica 89,90 €, authentique 130-150 €, rétro 60-90 €, enfant 70 €. Floquage 5 €, comparatif et bons plans.",
    keywords: "prix maillot psg, maillot psg pas cher, combien coute maillot psg, maillot psg 2026 prix",
    content: `<p>Le prix d'un maillot du Paris Saint-Germain dépend de plusieurs facteurs : version replica ou authentique, taille adulte ou enfant, saison en cours ou rétro, présence d'un floquage personnalisé. Voici un panorama complet des tarifs pratiqués en 2026 et de quoi situer ce que vous payez.</p>

<h2>Maillot PSG replica adulte (Stadium)</h2>
<p>C'est la version la plus vendue. <strong>Prix officiel boutique PSG : 89,90 €</strong> pour le maillot domicile, extérieur ou third de la saison en cours. Le maillot fourth ou les éditions Jordan x PSG montent à 99,90 €.</p>
<p>Sur Maillot-PSG, vous trouvez des replicas <strong>à partir de 25 €</strong> sur les saisons précédentes ou les modèles destockés, et entre 50 et 80 € pour les saisons récentes. C'est l'option la plus accessible pour un maillot porté au Parc des Princes.</p>

<h2>Maillot PSG authentique (Match Player Issue)</h2>
<p>La version professionnelle, identique à celle portée par les joueurs en match. <strong>Prix officiel : 130 à 150 €</strong> selon la saison et la coupe. Coupe ajustée, tissu Vaporknit, écusson et sponsor en relief siliconé.</p>
<p>C'est l'option des puristes. Si vous ne portez le maillot qu'en supporter et au quotidien, la replica suffit. Si vous le portez pour jouer ou que vous êtes collectionneur, l'authentique vaut sa différence de prix.</p>

<h2>Maillot PSG enfant</h2>
<p><strong>Prix officiel : 69,90 €</strong> pour les tailles 2 à 13 ans. Sur Maillot-PSG, comptez 25 à 60 € selon la saison et la disponibilité. Le rapport qualité/prix est intéressant car l'enfant grandit vite — autant ne pas surpayer un maillot qui sera trop petit dans 12 mois.</p>
<p>Notre conseil : prenez la taille au-dessus de l'âge réel de votre enfant. L'<a href="/livraison-retours">échange de taille reste gratuit</a> si vous vous trompez.</p>

<h2>Maillot PSG rétro et vintage</h2>
<p>Les prix varient énormément selon la pièce et son état :</p>
<ul>
<li><strong>Réédition récente</strong> (Ronaldinho 2001, Mbappé 2017, Ibrahimović 2012, Beckham 2013) : 60 à 90 €</li>
<li><strong>Original années 2000-2010 occasion</strong> : 80 à 200 € selon le joueur et l'état</li>
<li><strong>Original Jordan x PSG 2018-2019</strong> : 300 à 600 € sur le marché secondaire</li>
<li><strong>Pièce vintage années 70-90</strong> (Hechter, Ouest Foire, Tomy) : 150 à 800 € selon rareté</li>
</ul>
<p>Le maillot rétro est devenu un placement : les pièces iconiques prennent 5 à 15 % de valeur par an depuis 2018.</p>

<h2>Maillot gardien PSG</h2>
<p>Le maillot Donnarumma (ou tout autre gardien) est généralement vendu au même prix que le maillot champ : 89,90 € en replica officiel, 60 à 80 € sur Maillot-PSG.</p>

<h2>Tenue training PSG</h2>
<ul>
<li><strong>Sweat training</strong> : 60-90 €</li>
<li><strong>Veste training officielle</strong> : 80-120 €</li>
<li><strong>Polo PSG</strong> : 50-70 €</li>
<li><strong>Bas de survêtement</strong> : 50-80 €</li>
<li><strong>Ensemble complet</strong> : 130-180 €</li>
</ul>

<h2>Combien coûte le floquage en plus ?</h2>
<p>Sur Maillot-PSG, le <a href="/guide/floquage-maillot-psg">floquage personnalisé</a> est facturé <strong>5 €</strong> (nom + numéro, typographie officielle Ligue 1 ou Champions League). C'est l'un des prix les plus bas du marché — la boutique officielle PSG facture 14,99 €, et la plupart des revendeurs entre 15 et 25 €.</p>

<h2>Comment payer son maillot PSG moins cher ?</h2>
<p>Quelques pistes concrètes :</p>
<ul>
<li><strong>Acheter en fin de saison</strong> (mai-juillet) : les nouvelles collections arrivent et les anciennes baissent jusqu'à -50 %</li>
<li><strong>Cibler la saison N-1</strong> plutôt que la dernière : économie de 30 à 50 % pour un design quasi identique</li>
<li><strong>Surveiller les destockages</strong> sur tailles peu courantes (XS, 3XL, taille enfant 2 ans)</li>
<li><strong>Préférer la replica</strong> à l'authentique sauf usage spécifique</li>
<li><strong>Choisir une saison rétro déjà rééditée</strong> (Ronaldinho, Ibrahimović) : prix replica, valeur sentimentale forte</li>
</ul>

<h2>Et chez Maillot-PSG ?</h2>
<p>Notre catalogue couvre toutes les gammes : <a href="/maillots/domicile">maillots domicile</a> à partir de 25 €, <a href="/maillots/retro">maillots rétro</a> dès 30 €, <a href="/maillots/enfant">maillots enfant</a> dès 25 €. Floquage personnalisé 5 €, livraison 9 à 12 jours ouvrés.</p>`,
  },
  {
    slug: "maillot-psg-enfant-guide-achat",
    title: "Maillot PSG enfant : le guide d'achat complet par âge",
    excerpt:
      "Quel maillot PSG offrir à un enfant ? Guide d'achat par âge (2 à 13 ans), choix du joueur à floquer, prix, conseils cadeau Noël et anniversaire.",
    metaTitle: "Maillot PSG enfant : guide d'achat par âge 2026",
    metaDesc:
      "Maillot PSG pour enfant de 2 à 13 ans : tableau des tailles, choix du joueur à floquer, prix, conseils cadeau anniversaire et Noël. Échange gratuit.",
    keywords: "maillot psg enfant, maillot psg garcon, maillot psg cadeau, maillot psg 8 ans, maillot psg 10 ans",
    content: `<p>Offrir un maillot du PSG à un enfant, c'est un grand classique des cadeaux d'anniversaire et de Noël en France. Mais entre les tailles qui se chevauchent, le choix du joueur à floquer et le rapport qualité/prix, le bon achat n'est pas toujours évident. Voici notre guide complet.</p>

<h2>Quelle taille pour quel âge ?</h2>
<p>Sur Maillot-PSG, les tailles enfant vont de 2 à 13 ans. Voici les correspondances avec la taille en cm :</p>
<ul>
<li><strong>2-3 ans</strong> : 86-98 cm — pour les tout-petits</li>
<li><strong>4-5 ans</strong> : 98-110 cm — entrée de maternelle</li>
<li><strong>6-7 ans</strong> : 110-122 cm — CP-CE1</li>
<li><strong>8-9 ans</strong> : 122-134 cm — taille la plus demandée</li>
<li><strong>10-11 ans</strong> : 134-146 cm — CM1-CM2</li>
<li><strong>12-13 ans</strong> : 146-158 cm — collège</li>
</ul>
<p><strong>Conseil clé :</strong> en cas de doute entre deux tailles, prenez toujours la plus grande. Un enfant prend en moyenne 5 à 8 cm par an — un maillot un peu large dure deux saisons au lieu d'une.</p>

<h2>Quel maillot choisir pour un enfant ?</h2>
<p>Le <strong>maillot domicile bleu marine à bande rouge</strong> reste de loin le plus populaire. C'est le maillot iconique du PSG, celui que les enfants reconnaissent et réclament en priorité. Il se marie avec n'importe quel short et passe partout.</p>
<p>Le <strong>maillot extérieur blanc</strong> est plus polyvalent à porter en dehors du contexte foot. Le <strong>maillot third</strong> et les éditions Jordan x PSG ont la cote chez les enfants un peu plus âgés (10-13 ans) qui cherchent un look plus streetwear.</p>

<h2>Quel joueur floquer ?</h2>
<p>Au moment d'écrire ces lignes (saison 2025-2026), les <a href="/joueur">joueurs les plus floqués pour les enfants</a> sont :</p>
<ul>
<li><strong>Dembélé n°10</strong> : ballon d'or 2025, le préféré des enfants</li>
<li><strong>Donnarumma n°1</strong> : choix idéal pour un enfant qui joue au poste de gardien</li>
<li><strong>Hakimi n°2</strong> : très populaire, look énergique</li>
<li><strong>Désiré Doué n°14</strong> : jeune talent qui plaît aux 10-15 ans</li>
<li><strong>Mbappé n°7</strong> (rétro) : reste un grand classique malgré son départ en 2024</li>
<li><strong>Vitinha n°17</strong> : en montée, joueur élégant</li>
<li><strong>Marquinhos n°5</strong> : capitaine emblématique</li>
</ul>
<p>Demandez à l'enfant son joueur préféré avant de commander si possible — c'est l'élément qui fait toute la différence dans le cadeau. Sinon, jouez la sécurité avec Dembélé ou Donnarumma.</p>

<h2>Combien coûte un maillot PSG enfant ?</h2>
<p>Le prix officiel du maillot PSG enfant en boutique est de 69,90 €. Sur Maillot-PSG, vous trouvez des maillots PSG enfant à partir de 25 € (saisons précédentes) et entre 35 et 60 € pour la saison en cours. Le <a href="/guide/floquage-maillot-psg">floquage personnalisé est facturé 5 €</a> en supplément.</p>

<h2>Et si la taille est trop petite ou trop grande ?</h2>
<p>L'échange de taille est gratuit chez Maillot-PSG, sous 14 jours après réception. Le seul cas où l'échange n'est pas possible : maillot floqué personnalisé, sauf défaut produit (loi sur la rétractation pour biens personnalisés). C'est pour cela que nous insistons : <strong>vérifiez bien la taille avant d'ajouter l'option floquage.</strong></p>

<h2>Cadeau de dernière minute : nos conseils</h2>
<p>La livraison Maillot-PSG prend 9 à 12 jours ouvrés. Si Noël arrive vite et que vous êtes en retard, regardez du côté des maillots <strong>non floqués en stock</strong>. Le maillot brut est expédié plus rapidement, et vous pouvez glisser dans le paquet un mot type "floquage personnalisé à venir, choisis ton joueur" — l'enfant adore l'idée de personnaliser lui-même son cadeau.</p>

<h2>Pour aller plus loin</h2>
<ul>
<li><a href="/maillots/enfant">Voir tous les maillots PSG enfant</a></li>
<li><a href="/guide/comment-choisir-taille-maillot-psg">Guide complet des tailles</a></li>
<li><a href="/guide/floquage-maillot-psg">Tout savoir sur le floquage personnalisé</a></li>
</ul>`,
  },
  {
    slug: "reconnaitre-faux-maillot-psg",
    title: "Comment reconnaître un faux maillot PSG : 7 indices imparables",
    excerpt:
      "Étiquette, écusson, finitions, prix, sponsor, hologramme, emballage : 7 critères pour distinguer un vrai maillot PSG d'une contrefaçon.",
    metaTitle: "Faux maillot PSG : 7 indices pour reconnaître une contrefaçon",
    metaDesc:
      "Comment ne pas se faire arnaquer en achetant un maillot PSG : étiquette, écusson, swoosh Nike, sponsor, hologramme, prix. 7 critères imparables.",
    keywords: "faux maillot psg, contrefacon maillot psg, vrai maillot psg, comment reconnaitre vrai maillot foot",
    content: `<p>Le maillot du PSG est l'un des plus contrefaits au monde. Sur les marketplaces et certains sites obscurs, jusqu'à 80 % des maillots vendus seraient des copies. Ces faux ne ressemblent au vrai que de loin : tissu cheap, floquage qui craque, étiquette douteuse. Voici 7 critères pour ne plus jamais vous tromper.</p>

<h2>1. Le prix : si c'est trop beau, c'est faux</h2>
<p>Un maillot PSG replica neuf de la saison en cours coûte au minimum 50 € (en destockage très agressif) et plus souvent 70 à 90 €. Si vous tombez sur une offre à 19,90 € livré gratuit depuis l'Asie, c'est un faux à 99 %. Le coût matière + fabrication + licence rend impossible un prix neuf inférieur à 35-40 €.</p>
<p>Exception : un maillot d'une saison vraiment ancienne (3-4 ans), occasion, peut tomber sous les 25 €. Mais ça reste rare et toujours en seconde main.</p>

<h2>2. L'étiquette intérieure</h2>
<p>Sur un vrai maillot Nike PSG, vous trouvez côté nuque <strong>deux étiquettes cousues</strong> : une étiquette principale avec le logo Nike, l'année de production, le pays de fabrication (souvent Thaïlande, Vietnam, Cambodge ou Indonésie), et une étiquette secondaire avec la composition matière, les pictogrammes d'entretien et le code RN.</p>
<p>Une <strong>seule étiquette imprimée</strong> ou collée à chaud est un signe fort de contrefaçon. De même, une faute d'orthographe sur "polyester", un code RN absent ou un pays de fabrication "Made in China" sont suspects (Nike ne fabrique pas en Chine pour ses maillots premium).</p>

<h2>3. L'écusson PSG</h2>
<p>Sur un maillot replica officiel, l'écusson est <strong>brodé ou imprimé en haute densité</strong> avec des contours nets. Sur un faux, l'écusson est souvent imprimé à plat, les couleurs débordent, le rouge tire sur l'orange ou le bordeaux, le bleu sur le violet.</p>
<p>Sur un maillot authentique, l'écusson est <strong>cousu et embossé en relief</strong>. Si vous voyez un écusson plat sur un maillot vendu comme "authentique", c'est un faux.</p>

<h2>4. Le swoosh Nike</h2>
<p>Le logo Nike (swoosh) est un excellent révélateur. Sur le vrai, il est <strong>parfaitement symétrique</strong>, contour net, finition mate ou siliconée selon le modèle. Sur un faux, il est souvent légèrement déformé, asymétrique, ou avec un dégradé bizarre. Comparez avec une photo officielle Nike avant achat.</p>

<h2>5. Le sponsor (Qatar Airways, GOAT, etc.)</h2>
<p>Le sponsor principal du PSG (Qatar Airways depuis 2014, partenariat évolutif) est appliqué en <strong>flocage haute qualité, parfaitement aligné, coloris exact</strong>. Sur les contrefaçons, le sponsor est typiquement plus pâle, mal positionné (souvent décalé de 2-3 cm), ou la typo des lettres ne correspond pas exactement à la version officielle.</p>

<h2>6. Le tissu et les finitions intérieures</h2>
<p>Touchez le maillot. Un vrai PSG Nike Dri-FIT est <strong>léger, lisse, sec au toucher</strong>, avec des coutures fines et régulières (souvent en zigzag plat). Sur un faux, le tissu est plus épais, plus rugueux, parfois brillant comme du polyester premier prix. Les coutures sont grossières, parfois doubles, avec des fils qui dépassent.</p>
<p>Retournez le maillot et regardez les coutures du col, des manches et des côtés. Les finitions intérieures sont quasi toujours bâclées sur les contrefaçons.</p>

<h2>7. L'emballage et l'hologramme</h2>
<p>Un vrai maillot Nike PSG arrive plié dans un sachet plastique transparent, avec parfois une notice et un sticker hologramme rond avec swoosh Nike. Si le maillot arrive froissé, sans emballage, sans étiquette de prix d'origine, sans hologramme, méfiez-vous. Attention : les <strong>faux peuvent imiter l'hologramme</strong> aujourd'hui — ce critère seul ne suffit pas.</p>

<h2>Et chez Maillot-PSG ?</h2>
<p>Tous nos maillots sont sourcés directement et vérifiés un par un avant expédition. Pas de mauvaise surprise sur le tissu, le floquage ou les finitions. <a href="/contact">Une question avant achat ?</a> Notre équipe vous répond en moins de 24h.</p>

<h2>Récap : la check-list anti-contrefaçon</h2>
<ul>
<li>Prix neuf jamais en dessous de 35-40 €</li>
<li>Deux étiquettes cousues côté nuque</li>
<li>Écusson PSG net, contours propres, coloris exact</li>
<li>Swoosh Nike symétrique et parfaitement positionné</li>
<li>Sponsor floqué avec précision</li>
<li>Tissu léger, lisse, coutures fines</li>
<li>Emballage Nike d'origine si neuf</li>
</ul>`,
  },
  {
    slug: "maillot-psg-mbappe-tous-modeles",
    title: "Maillot PSG Mbappé : tous les modèles depuis 2017",
    excerpt:
      "Tous les maillots portés par Kylian Mbappé au PSG entre 2017 et 2024 : domicile, extérieur, third, fourth, finales et collectors. Guide collection complet.",
    metaTitle: "Maillot PSG Mbappé : tous les modèles 2017-2024",
    metaDesc:
      "Liste complète des maillots de Kylian Mbappé au PSG entre 2017 et 2024 : domicile, extérieur, third, fourth, Jordan, finales. Floquage Mbappé n°7 et n°10.",
    keywords: "maillot psg mbappe, maillot mbappe psg 7, maillot mbappe psg 10, maillot psg mbappe retro",
    content: `<p>Kylian Mbappé a porté le maillot du Paris Saint-Germain pendant sept saisons, de 2017 à 2024. Plus de 30 maillots différents l'ont accompagné durant cette ère, entre domicile, extérieur, third, fourth, éditions Jordan et finales européennes. Voici la liste complète et ce qu'il faut savoir pour collectionner ou floquer un maillot Mbappé en 2026.</p>

<h2>Saison 2017-2018 : le maillot du recrutement</h2>
<p>Recruté à l'été 2017 en provenance de Monaco pour 180 millions d'euros, Mbappé porte d'abord le numéro 29. Le maillot domicile bleu marine à bande blanche centrale (sponsor Fly Emirates, Jordan absent) reste l'un des plus emblématiques de l'ère QSI. Mbappé inscrit son premier triplé pour le PSG avec lors de cette saison.</p>

<h2>Saison 2018-2019 : la révolution Jordan</h2>
<p>Le PSG devient le premier club de foot à porter la marque Jordan. Mbappé porte le maillot Jordan x PSG noir aux logos Jumpman dorés en Ligue des champions. Pièce devenue ultra collector aujourd'hui (300-600 € sur le marché secondaire). Côté Ligue 1, Mbappé bascule sur le numéro 7 emblématique qu'il portera jusqu'à son départ.</p>

<h2>Saison 2019-2020 : la finale de Lisbonne</h2>
<p>Maillot domicile Nike au design plus épuré, et maillot Jordan blanc oversize porté en C1. C'est avec ce maillot que Mbappé dispute la finale de Ligue des champions face au Bayern Munich (0-1) à Lisbonne en août 2020.</p>

<h2>Saison 2020-2021 : le rose mythique</h2>
<p>Le maillot Jordan x PSG troisième maillot rose poudré associé au noir devient une pièce signature de l'histoire du foot. Mbappé porte ce maillot en Ligue des champions. C'est aussi la saison des 42 buts en compétition pour Mbappé.</p>

<h2>Saison 2021-2022 : Messi arrive</h2>
<p>Mbappé porte le maillot domicile bleu nuit avec bande verticale blanche, bordée de rouge. C'est la saison de l'arrivée de Lionel Messi : on voit Mbappé n°7 et Messi n°30 sur les mêmes photos. Le maillot Jordan third bleu ciel et rouge est également emblématique.</p>

<h2>Saison 2022-2023 : record de buts en C1</h2>
<p>Maillot domicile noir-bleu avec bande rouge centrale large. Mbappé devient meilleur buteur de l'histoire du PSG en novembre 2022. Le maillot Jordan third rouge feu est aussi très demandé.</p>

<h2>Saison 2023-2024 : la dernière danse</h2>
<p>Maillot domicile Nike inspiré du Hechter 1973, avec bande rouge centrale fine. Mbappé porte le brassard de capitaine après le départ de Marquinhos sur certains matchs. Maillot fourth Jordan rouge éclatant porté en C1. Mbappé annonce son départ en mars 2024 et inscrit son dernier but pour le PSG fin mai. Ce maillot devient instantanément collector.</p>

<h2>Maillots de finales</h2>
<p>Mbappé a disputé une finale de Ligue des champions (2020), trois finales de Coupe de France (2017-2018, 2019-2020, 2020-2021, 2023-2024) et plusieurs finales de Coupe de la Ligue. Tous les maillots de finale ont des écussons spécifiques avec patch "Final" et la date — ces versions sont rarissimes en occasion.</p>

<h2>Quel maillot Mbappé acheter aujourd'hui ?</h2>
<p>Sur le marché actuel, plusieurs options selon votre budget :</p>
<ul>
<li><strong>Réédition Mbappé 2017-2018</strong> : 60-90 €, le maillot du recrutement</li>
<li><strong>Réédition Mbappé 2020-2021 rose Jordan</strong> : 90-150 €, le maillot le plus iconique</li>
<li><strong>Maillot 2023-2024 occasion</strong> : 80-120 €, sa dernière saison</li>
<li><strong>Original Jordan x PSG 2018-2019 floqué Mbappé 7</strong> : 400-700 € (collector rare)</li>
</ul>

<h2>Floquer "Mbappé 7" en 2026 : possible ?</h2>
<p>Oui. Même si Kylian Mbappé n'est plus au club, sa <a href="/joueur/mbappe">légende reste indissociable du PSG</a>. Vous pouvez floquer "MBAPPE 7" sur n'importe quel maillot rétro PSG des saisons 2017 à 2024 — il a porté ce numéro toute son aventure parisienne. Pour un floquage Mbappé sur maillot moderne 2025-2026, c'est techniquement possible mais peu cohérent puisqu'il évolue désormais au Real Madrid.</p>
<p>Le floquage personnalisé "MBAPPE 7" est facturé 5 € chez Maillot-PSG, en typographie Ligue 1 ou Champions League selon le maillot.</p>

<h2>Pour aller plus loin</h2>
<ul>
<li><a href="/joueur/mbappe">Voir tous les maillots floquables Mbappé</a></li>
<li><a href="/maillots/retro">Maillots PSG rétro toutes saisons</a></li>
<li><a href="/guide/maillots-psg-iconiques">Top 10 des maillots PSG iconiques</a></li>
</ul>`,
  },
  {
    slug: "etoile-doree-maillot-psg-2025",
    title: "Étoile dorée maillot PSG : signification et histoire du triplé 2025",
    excerpt:
      "Pourquoi le maillot du PSG porte une étoile dorée depuis 2025 ? Histoire du triplé historique, signification de l'étoile, comment elle est positionnée sur le maillot.",
    metaTitle: "Étoile dorée maillot PSG : la signification du triplé 2025",
    metaDesc:
      "Tout sur l'étoile dorée du maillot PSG depuis 2025 : signification, triplé historique Ligue des champions / Ligue 1 / Coupe de France, position sur le maillot.",
    keywords: "etoile doree psg, etoile maillot psg, psg ligue des champions 2025, triple psg 2025, maillot psg etoile",
    content: `<p>Vous l'avez peut-être remarqué : depuis la saison 2025-2026, le maillot du Paris Saint-Germain porte une <strong>étoile dorée au-dessus de l'écusson</strong>. Ce détail discret en apparence est pourtant l'un des éléments les plus chargés en histoire de toute la collection actuelle. Voici son origine et sa signification.</p>

<h2>L'étoile dorée : un trophée de Ligue des champions</h2>
<p>L'étoile dorée brodée au-dessus de l'écusson PSG symbolise la <strong>première victoire en Ligue des champions UEFA</strong> du club, conquise en mai 2025 face à l'Inter Milan (5-0) à Munich. C'est le titre le plus important de l'histoire du PSG, attendu par les supporters depuis 1995 et la première demi-finale européenne du club.</p>
<p>Cette tradition de l'étoile au-dessus de l'écusson est partagée par d'autres grands clubs européens vainqueurs de la C1 : le Real Madrid en porte plusieurs (une par tranche de 5 victoires dans certaines déclinaisons), le Bayern Munich, Liverpool, Manchester United, le Milan AC, etc.</p>

<h2>Position et design de l'étoile sur le maillot PSG</h2>
<p>L'étoile dorée est positionnée :</p>
<ul>
<li>Au-dessus de l'écusson PSG, alignée verticalement avec son centre</li>
<li>Hauteur d'environ 10 mm, finition brodée dorée</li>
<li>Présente sur tous les maillots officiels Nike PSG 2025-2026 (domicile, extérieur, third, fourth, gardien, training)</li>
<li>Également présente sur les maillots enfant et sur les versions replica comme authentique</li>
</ul>

<h2>Le triplé 2024-2025 en détail</h2>
<p>La saison 2024-2025 restera dans l'histoire du PSG comme la plus aboutie. Le club a remporté trois trophées majeurs sur la même saison :</p>
<ul>
<li><strong>Ligue des champions</strong> : 5-0 contre l'Inter Milan en finale à Munich (mai 2025) — premier sacre européen du club</li>
<li><strong>Ligue 1</strong> : titre acquis dès la 30<sup>e</sup> journée, 11<sup>e</sup> championnat de l'histoire du PSG</li>
<li><strong>Coupe de France</strong> : 16<sup>e</sup> Coupe de France remportée — le PSG est le club le plus titré dans cette compétition</li>
</ul>
<p>Le club est passé tout près du quadruplé puisqu'il a perdu en finale du Trophée des Champions face à Monaco l'été suivant.</p>

<h2>Les héros du triplé</h2>
<p>Plusieurs joueurs ont marqué cette saison historique :</p>
<ul>
<li><strong>Ousmane Dembélé</strong> : ballon d'or 2025, attaquant majeur de la finale de C1</li>
<li><strong>Gianluigi Donnarumma</strong> : héros de la finale, plusieurs arrêts décisifs</li>
<li><strong>Achraf Hakimi</strong> : 12 buts toutes compétitions, latéral le plus offensif d'Europe</li>
<li><strong>Désiré Doué</strong> : MVP de la finale C1 à 19 ans (doublé)</li>
<li><strong>Marquinhos</strong> : capitaine au sommet, performance défensive monumentale</li>
<li><strong>Vitinha</strong> : milieu de terrain dominant la finale</li>
<li><strong>Khvicha Kvaratskhelia</strong> : recrue hivernale, instantanément décisive</li>
</ul>

<h2>Maillots commémoratifs du triplé</h2>
<p>Plusieurs versions spéciales du maillot ont été éditées pour marquer le triplé :</p>
<ul>
<li><strong>Maillot domicile 2025-2026 avec étoile dorée brodée</strong></li>
<li><strong>Maillot fourth Jordan rouge édition triplé</strong> avec patch commémoratif "Champions of Europe 2025"</li>
<li><strong>Réédition collector du maillot porté en finale</strong> avec patch "Final Munich 2025"</li>
<li><strong>Maillot training "Champions" doré</strong> distribué aux joueurs lors du défilé</li>
</ul>

<h2>Le maillot avec étoile dorée comme pièce de collection</h2>
<p>Les maillots PSG 2025-2026 avec étoile dorée seront probablement parmi les plus collectionnés des années à venir. C'est la première saison où le club arbore officiellement cette distinction, ce qui en fait une pièce historique. Pour les supporters parisiens, c'est <strong>l'équivalent du maillot Italie 2006 ou Espagne 2010</strong> : une saison qui marque à vie.</p>

<h2>Acheter votre maillot PSG avec étoile dorée</h2>
<p>Tous nos <a href="/saison">maillots de la saison 2025-2026</a> portent l'étoile brodée. Floquage Dembélé, Doué, Donnarumma ou votre propre nom personnalisable pour 5 €.</p>
<ul>
<li><a href="/maillots/domicile">Maillot domicile 2025-2026</a></li>
<li><a href="/maillots/exterieur">Maillot extérieur 2025-2026</a></li>
<li><a href="/maillots/third">Maillot third 2025-2026</a></li>
</ul>`,
  },
  {
    slug: "maillot-gardien-psg-donnarumma",
    title: "Maillot gardien PSG : guide complet Donnarumma 2021-2026",
    excerpt:
      "Tous les maillots de gardien du PSG portés par Gianluigi Donnarumma depuis 2021. Coloris, designs, prix, floquage personnalisé et conseils d'achat.",
    metaTitle: "Maillot gardien PSG Donnarumma : tous les modèles 2021-2026",
    metaDesc:
      "Guide complet des maillots de gardien du PSG portés par Donnarumma depuis 2021. Couleurs, designs, prix, floquage. Maillot gardien enfant et adulte.",
    keywords: "maillot gardien psg, maillot donnarumma, maillot gardien psg donnarumma, maillot gardien psg enfant",
    content: `<p>Gianluigi Donnarumma est le gardien titulaire du Paris Saint-Germain depuis 2021. Héros de la finale de Ligue des champions 2025, c'est aujourd'hui l'un des joueurs les plus floqués sur les maillots du club. Voici le guide complet des maillots de gardien PSG depuis l'arrivée de "Gigio".</p>

<h2>Pourquoi un maillot de gardien différent ?</h2>
<p>Selon les règles UEFA et FIFA, le gardien de but doit porter un maillot de couleur distincte de celle de ses coéquipiers, de l'arbitre et du gardien adverse. Concrètement, chaque saison, le PSG décline 3 à 4 coloris différents pour le gardien : un coloris dominant et plusieurs alternatives selon les confrontations.</p>
<p>Le maillot de gardien a aussi des spécificités techniques : <strong>épaulettes renforcées</strong>, <strong>tissu plus respirant aux aisselles</strong>, parfois des <strong>protections coudes</strong> en option. La coupe est légèrement plus ample que le maillot de champ pour faciliter les plongeons.</p>

<h2>Saison 2021-2022 : l'arrivée de Donnarumma</h2>
<p>Donnarumma signe libre au PSG après son sacre à l'Euro 2020 avec l'Italie. Il porte d'abord le numéro 50, puis le numéro 99 pour ses débuts officiels. Maillot gardien dominant : <strong>noir avec liserés rouges</strong>, manches motif géométrique. Coloris alternatif : vert phosphorescent.</p>

<h2>Saison 2022-2023 : le numéro 99</h2>
<p>Donnarumma s'impose comme titulaire indiscutable. Maillot gardien <strong>orange fluo</strong> ultra reconnaissable, devenu très populaire chez les supporters. Coloris alternatif : violet avec dégradé.</p>

<h2>Saison 2023-2024 : la sobriété</h2>
<p>Maillot gardien <strong>gris anthracite</strong> avec col rouge et liserés bleu marine. Design plus épuré, en accord avec la nouvelle direction artistique de Nike. Coloris alternatifs : vert kaki et noir intégral.</p>

<h2>Saison 2024-2025 : le maillot du sacre</h2>
<p>C'est avec ce maillot que Donnarumma soulève la Ligue des champions à Munich face à l'Inter Milan. Maillot dominant : <strong>bleu turquoise vif</strong> avec motif géométrique en filigrane. Maillot porté en finale : <strong>noir avec liserés dorés</strong>. Cette version finale est devenue l'une des plus recherchées sur le marché secondaire (200-400 € en occasion).</p>

<h2>Saison 2025-2026 : étoile dorée</h2>
<p>Donnarumma change de numéro et reprend le <strong>1 historique</strong> du gardien titulaire. Maillot dominant : <strong>jaune doré</strong> en référence à l'étoile européenne fraîchement conquise, avec étoile brodée au-dessus de l'écusson. Coloris alternatifs : noir avec liserés or, et vert d'eau.</p>

<h2>Combien coûte un maillot gardien PSG ?</h2>
<ul>
<li><strong>Maillot gardien adulte replica</strong> : 89,90 € en boutique officielle, 50 à 80 € sur Maillot-PSG selon la saison</li>
<li><strong>Maillot gardien adulte authentique</strong> : 130 à 150 €</li>
<li><strong>Maillot gardien enfant</strong> : 69,90 € officiel, 35 à 60 € chez nous</li>
<li><strong>Maillot gardien rétro</strong> (Buffon 2018-2019, Trapp 2015-2016) : 70 à 150 € selon état</li>
</ul>

<h2>Floquage du maillot gardien</h2>
<p>Le maillot gardien se floque comme les autres maillots du PSG. Floquage personnalisé Donnarumma 1, à votre nom, ou pour un enfant qui joue gardien dans son club : <strong>5 € seulement chez Maillot-PSG</strong>. Typographie officielle Ligue 1 ou Champions League selon la saison du maillot.</p>

<h2>Pour qui ?</h2>
<p>Le maillot gardien PSG est un excellent choix pour :</p>
<ul>
<li><strong>Les enfants qui jouent au poste de gardien</strong> dans leur club</li>
<li><strong>Les fans de Donnarumma</strong> ou des grands gardiens parisiens (Lama, Buffon, Areola)</li>
<li><strong>Les collectionneurs</strong> qui aiment les coloris atypiques (orange, vert phospho, jaune doré)</li>
<li><strong>Ceux qui veulent un maillot PSG "qui sort du lot"</strong> et ne ressemble pas à celui de tout le monde</li>
</ul>

<h2>Pour aller plus loin</h2>
<ul>
<li><a href="/maillots/gardien">Voir tous les maillots gardien PSG</a></li>
<li><a href="/joueur/donnarumma">Maillots floquables Donnarumma</a></li>
<li><a href="/guide/maillot-psg-authentique-vs-replica">Replica vs authentique : quelle différence</a></li>
</ul>`,
  },
];

async function main() {
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  console.log(`✓ ${cats.length} catégories`);

  for (const s of seasons) {
    await prisma.season.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`✓ ${seasons.length} saisons`);

  for (const p of players) {
    await prisma.player.upsert({ where: { slug: p.slug }, update: p, create: p });
  }
  console.log(`✓ ${players.length} joueurs`);

  for (const g of guides) {
    await prisma.guide.upsert({ where: { slug: g.slug }, update: g, create: g });
  }
  console.log(`✓ ${guides.length} guides`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
