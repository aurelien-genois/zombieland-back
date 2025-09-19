import { prisma } from "./index.js";

async function main() {
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.category.deleteMany();

  const adminRole = await prisma.role.create({
    data: { name: "admin" },
  });
  const userRole = await prisma.role.create({
    data: { name: "user" },
  });

  await prisma.user.createMany({
    data: [
      {
        firstname: "Michel",
        lastname: "Zombie",
        email: "michel@zombie.com",
        password:
          "$2b$10$L1uJRrojE9mzjFfCmF43pOZAbltzzOG/.HSgbRAIFB4gBEYArzW7a",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
      {
        firstname: "Aurélien",
        lastname: "Zombie",
        email: "aurelien@zombie.com",
        password:
          "$2b$10$mOvf9oNbtRsuxoT5YLVhC.ZefQoa3IPtBgH963ixKHmWvUViZHnau",
        is_active: false,
        phone: "+33687654321",
        birthday: new Date("1990-10-22"),
        last_login: null,
        role_id: adminRole.id,
      },
      {
        firstname: "Loic",
        lastname: "Zombie",
        email: "loic@zombie.com",
        password:
          "$2b$10$96WSOMYdgeOKz1qIzjss9.R/2URXgtrTYQuZ/HitQEXM/zWmea/Mm",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
      {
        firstname: "Wilfried",
        lastname: "Zombie",
        email: "wilfried@zombie.com",
        password:
          "$2b$10$4kzwNfna84ImsKz04OrCnOeXdJPQBnpgfc1z4DmoxM/NZFOQKZ9si",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
    ],
  });

  console.log("4 users inserted !");

  const categories = await prisma.category.createManyAndReturn({
    data: [
      {
        name: "Spectacle",
        color: "red",
      },
      {
        name: "Manège",
        color: "green",
      },
      {
        name: "Montagne russe",
        color: "blue",
      },
      {
        name: "Restaurant",
        color: "orange",
      },
      {
        name: "Jeux",
        color: "pink",
      },
      {
        name: "Boutique",
        color: "yellow",
      },
    ],
  });

  console.log("categories inserted !");

  const categoriesKeys = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, number>);

  await prisma.activity.createMany({
    data: [
      {
        name: "Cabaret des Morts-Vivants",
        slug: "cabaret-des-morts-vivants",
        slogan:
          "Entrez dans la nuit, laissez les morts-vivants vous faire danser !",
        description:
          "Le rideau se lève et les zombies envahissent la scène ! Entre chorégraphies macabres, effets pyrotechniques et humour noir, ce cabaret déjanté vous plonge dans une ambiance à la fois terrifiante et hilarante. Les danseurs s’approchent parfois du public pour une immersion totale, transformant chaque spectateur en complice de ce show d’outre-tombe.",
        minimum_age: 0,
        duration: "2h00",
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1662558066589-e452d46b9ff9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Spectacle"],
      },
      {
        name: "Apocalypse Live",
        slug: "apocalypse-live",
        slogan: "Un spectacle où VOUS devenez le héros de la survie !",
        description:
          "Vous n’êtes pas juste spectateur : vous êtes au cœur d’une histoire de survie ! Cascades spectaculaires, combats chorégraphiés, explosions de véhicules et interventions d’acteurs zombies rendent cette représentation unique. À chaque représentation, le public doit faire des choix qui influenceront la fin du show.",
        minimum_age: 1,
        duration: "1h30",
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://plus.unsplash.com/premium_photo-1723736712467-a4a7266becc8?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Spectacle"],
      },
      {
        name: "Symphonie de l’Enfer",
        slug: "symphonie-de-lenfer",
        slogan: "Un concert à réveiller les morts… et vos tympans !",
        description:
          "Les zombies musiciens reprennent vos morceaux préférés en version rock/métal dans une mise en scène gothique impressionnante. Fumées colorées, éclairages stroboscopiques et riffs électriques vous immergent dans un véritable concert de l’au-delà.",
        minimum_age: 0,
        duration: "2h15",
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url:
          "https://plus.unsplash.com/premium_photo-1664303098912-a7f2ee19153f?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Spectacle"],
      },
      {
        name: "Zombie Stand-Up",
        slug: "zombie-stand-up",
        slogan: "Parce qu’après la fin du monde, il faut bien rire un peu !",
        description:
          "Un humoriste en décomposition se moque de tout : des humains, de la pandémie et même de lui-même ! Préparez-vous à un humour grinçant, des improvisations avec le public et quelques frayeurs… juste pour le plaisir de vous entendre crier (et rire).",
        minimum_age: 2,
        duration: "1h00",
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1517936788989-5689e31c3c09?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Spectacle"],
      },
      {
        name: "La Ronde des Infectés",
        slug: "la-ronde-des-infectes",
        slogan: "Un tour pour petits… et morts-vivants !",
        description:
          "Montez dans des véhicules de secours et traversez un parcours infesté de zombies animatroniques qui surgissent pour tenter de vous attraper. Un manège familial parfait pour les jeunes explorateurs en quête de sensations douces mais palpitantes.",
        minimum_age: 0,
        duration: "15min",
        disabled_access: false,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1564838517303-0106e32cb50d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Manège"],
      },
      {
        name: "Le Cimetière Enchanté",
        slug: "le-cimetiere-enchante",
        slogan: "Quand les tombes s’ouvrent, tout peut arriver.",
        description:
          "Un petit train fantôme adapté aux familles : squelettes dansants, fantômes lumineux et ambiance mystérieuse, sans être trop effrayant.",
        minimum_age: 1,
        duration: "20min",
        disabled_access: false,
        high_intensity: false,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1570633047828-a042eb17791c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Manège"],
      },
      {
        name: "Le Tourniquet Hanté",
        slug: "le-tourniquet-hante",
        slogan: "Tournez avant qu’ils ne vous attrapent !",
        description:
          "Un manège rotatif rapide où les bras de zombies surgissent du sol pour tenter de saisir les passagers. Plus ça tourne, plus ils s’approchent !",
        minimum_age: 3,
        duration: "20min",
        disabled_access: false,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1639316132581-bcd993f3d6cd?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Manège"],
      },
      {
        name: "La Balade de l’Infecté",
        slug: "la-balade-de-linfecte",
        slogan: "Une promenade qui se termine rarement bien...",
        description:
          "Montez dans des wagonnets et traversez un village infesté de zombies. Cris, fumée et bruitages effrayants donnent l’impression d’être traqué.",
        minimum_age: 2,
        duration: "30min",
        disabled_access: false,
        high_intensity: true,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1715534410678-3d93848a74ad?q=80&w=1422&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Manège"],
      },
      {
        name: "Chaises Volantes de l’Enfer",
        slug: "chaises-volantes-de-lenfer",
        slogan: "Ils vous feront tourner… jusqu’à la morsure.",
        description:
          "Des chaises volantes qui passent à travers des cercles de fumée et frôlent des zombies suspendus. Idéal pour les amateurs de sensations modérées.",
        minimum_age: 2,
        duration: "20min",
        disabled_access: false,
        high_intensity: true,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1551835609-53c51e4139c1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Manège"],
      },
      {
        name: "La Fuite du Dernier Survivant",
        slug: "la-fuite-du-dernier-survivant",
        slogan: "Tiendrez-vous jusqu’à la fin de la course ?",
        description:
          "Une montagne russe à grande vitesse dans un décor de ville en ruines. Tunnels sombres, virages serrés et zombies qui surgissent à chaque tournant !",
        minimum_age: 3,
        duration: "25min",
        disabled_access: false,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1516051662687-567d7c4e8f6a?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Train du Chaos",
        slug: "train-du-chaos",
        slogan: "Plus vite que la contamination !",
        description:
          "Un coaster endiablé qui vous propulse hors d’une zone infectée juste avant l’explosion finale. Sensations fortes garanties.",
        minimum_age: 3,
        duration: "30min",
        disabled_access: false,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1651503774346-2cc93170feb9?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Infection Express",
        slug: "infection-express",
        slogan: "La pandémie n’attend pas.",
        description:
          "Montez dans ce train supersonique et échappez à un nuage toxique qui vous poursuit. Effets de fumée et bruitages réalistes ajoutent à l’adrénaline.",
        minimum_age: 3,
        duration: "3years",
        disabled_access: true,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1584466990930-7cb4999ad36b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Scream Coaster",
        slug: "scream-coaster",
        slogan: "Hurlez avant qu’il ne soit trop tard !",
        description:
          "Loopings, descentes vertigineuses et hurlements de zombies qui résonnent tout au long du parcours. Une expérience qui porte bien son nom.",
        minimum_age: 3,
        duration: "10min",
        disabled_access: false,
        high_intensity: true,
        status: "draft",
        image_url:
          "https://plus.unsplash.com/premium_photo-1731101561640-49ff85058f1e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Tombeau à Grande Vitesse",
        slug: "tombeau-a-grande-vitesse",
        slogan: "Une descente droit dans l’au-delà.",
        description:
          "Cette attraction plonge les visiteurs dans des catacombes sombres avant de les propulser dans une descente à couper le souffle.",
        minimum_age: 2,
        duration: "25min",
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1586836476603-ce713984045e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Virus Loop",
        slug: "virus-loop",
        slogan: "Attention à la contamination circulaire.",
        description:
          "Une succession de loopings vertigineux dans une ambiance de laboratoire contaminé. Parfait pour les amateurs de sensations extrêmes.",
        minimum_age: 3,
        duration: "10min",
        disabled_access: false,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1627035983655-0ceec61bb733?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Rage des Morts",
        slug: "rage-des-morts",
        slogan: "La horde vous poursuit.",
        description:
          "Un coaster où l’on sent presque les zombies courir derrière soi grâce à un système sonore et visuel immersif.",
        minimum_age: 1,
        duration: "30min",
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://plus.unsplash.com/premium_photo-1732614449839-4580ecf090dd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Ride of the Dead",
        slug: "ride-of-the-dead",
        slogan: "Jusqu’où oserez-vous aller ?",
        description:
          "Une course à travers un cimetière hanté, avec des cercueils qui s’ouvrent et des esprits qui surgissent dans les virages.",
        minimum_age: 2,
        duration: "20min",
        disabled_access: true,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1582198790133-3692e01f649c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Blackout Apocalypse",
        slug: "blackout-apocalypse",
        slogan: "Quand la lumière s’éteint…",
        description:
          "Un coaster dans le noir complet, avec des jumpscares imprévisibles et des effets lumineux qui simulent une panne d’électricité.",
        minimum_age: 3,
        duration: "15min",
        disabled_access: false,
        high_intensity: true,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1742327025819-af03d3cfeef2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Montagne russe"],
      },
      {
        name: "Snack Cerveau Frais",
        slug: "snack-cerveau-frais",
        slogan: "Des encas qui réveillent vos instincts les plus… primitifs.",
        description:
          "Snacks en forme de cerveaux, hot-dogs sanguinolents (ketchup spécial), et cocktails fluorescents. Idéal pour reprendre des forces.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1580016077595-1e63d3fad661?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Burger du Fossoyeur",
        slug: "burger-du-fossoyeur",
        slogan: "Des burgers à mourir de plaisir.",
        description:
          "Burgers saignants, frites en forme d’os et ambiance lugubre. Serveurs costumés en fossoyeurs pour parfaire l’expérience.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1588155664232-8aa20befe9e7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Cantine de l’Abri",
        slug: "cantine-de-labri",
        slogan: "Mangez comme un vrai survivant.",
        description:
          "Buffet à volonté dans un décor de bunker, avec musique d’ambiance radio de l’apocalypse et rations revisitées.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1571244002754-8cb2f3e33f59?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Sanguine Bar",
        slug: "sanguine-bar",
        slogan: "Osez boire le breuvage interdit.",
        description:
          "Cocktails rouges, smoothies 'plasma' et boissons servies dans des seringues géantes pour un effet spectaculaire.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1635259092546-a597c290c285?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Pizza de la Peste",
        slug: "pizza-de-la-peste",
        slogan: "Des recettes qui reviennent d’outre-tombe.",
        description:
          "Pizzas aux garnitures originales, pâte noire au charbon végétal et sauces aux couleurs étranges.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1601123994339-7dedc8ed399b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Infecté Glacé",
        slug: "infecte-glace",
        slogan: "Une douceur qui glace le sang.",
        description:
          "Stand de glaces fluorescentes et sorbets 'toxiques' qui brillent sous lumière noire. Idéal pour une pause rafraîchissante.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1632288995246-a0b2bd1719ac?q=80&w=1385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Brasserie des Survivants",
        slug: "brasserie-des-survivants",
        slogan: "Pour trinquer à votre survie.",
        description:
          "Bières artisanales thématiques, snacks salés et ambiance de camp de réfugiés pour une expérience conviviale.",
        minimum_age: 3,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://plus.unsplash.com/premium_photo-1664391715716-a8f8d6b88814?q=80&w=779&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Restaurant"],
      },
      {
        name: "Tir à la Tête",
        slug: "tir-a-la-tete",
        slogan: "Montrez que vous visez juste.",
        description:
          "Stand de tir interactif avec zombies animés. Gagnez des points pour chaque tête touchée et remportez des récompenses.",
        minimum_age: 2,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://plus.unsplash.com/premium_photo-1664474797276-64f949610b00?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Chasse au Remède",
        slug: "chasse-au-remede",
        slogan: "Trouvez l’antidote avant qu’il ne soit trop tard.",
        description:
          "Un jeu de piste grandeur nature où vous devez résoudre des énigmes pour récupérer un vaccin caché.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1542015644587-425b23f310b2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Lancer de Machette",
        slug: "lancer-de-machette",
        slogan: "Tranchez comme un pro.",
        description:
          "Version sécurisée du lancer de haches, avec cibles en forme de têtes de zombies.",
        minimum_age: 3,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1746786158644-6514c382f78e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Attrape ton Zombie",
        slug: "attrape-ton-zombie",
        slogan: "Saurez-vous les capturer tous ?",
        description:
          "Un stand de pêche aux peluches zombies, parfait pour les enfants et les chasseurs de trophées.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1699969288839-52e11483d162?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Survivor VR",
        slug: "survivor-vr",
        slogan: "Vivez l’apocalypse de l’intérieur.",
        description:
          "Une expérience en réalité virtuelle où vous devez échapper à une horde dans un supermarché abandonné.",
        minimum_age: 2,
        duration: null,
        disabled_access: false,
        high_intensity: true,
        status: "draft",
        image_url:
          "https://images.unsplash.com/photo-1592477725143-2e57dc728f0a?q=80&w=1406&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Z-Carnival",
        slug: "z-carnival",
        slogan: "La fête foraine, mais version apocalypse.",
        description:
          "Mini-jeux classiques (tir, lancer d’anneaux, chamboule-tout) revisités avec des décors post-apocalyptiques.",
        minimum_age: 1,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1614153730757-f66b13802341?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Course au Sérum",
        slug: "course-au-serum",
        slogan: "Rapide ou contaminé !",
        description:
          "Parcours chronométré où vous devez traverser une zone infestée pour rapporter le précieux sérum à temps.",
        minimum_age: 1,
        duration: null,
        disabled_access: false,
        high_intensity: false,
        status: "published",
        image_url:
          "https://images.unsplash.com/photo-1645981294161-ada18e0877e6?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category_id: categoriesKeys["Jeux"],
      },
      {
        name: "Zombie Chic",
        slug: "zombie-chic",
        slogan: "Du style même en cas d’invasion.",
        description:
          "T-shirts, casquettes et accessoires ensanglantés pour repartir looké comme un survivant stylé.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url: "",
        category_id: categoriesKeys["Boutique"],
      },
      {
        name: "Survivor Gear",
        slug: "survivor-gear",
        slogan: "Équipez-vous pour résister.",
        description:
          "Lampes, faux fusils, gourdes et tout l’équipement du parfait survivant.",
        minimum_age: 2,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url: "",
        category_id: categoriesKeys["Boutique"],
      },
      {
        name: "Deadly Merch",
        slug: "deadly-merch",
        slogan: "Les morts-vivants sont à collectionner.",
        description:
          "Peluches zombies, figurines et goodies pour petits et grands fans.",
        minimum_age: 0,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "draft",
        image_url: "",
        category_id: categoriesKeys["Boutique"],
      },
      {
        name: "Pharmacie de l’Apocalypse",
        slug: "pharmacie-de-lapocalypse",
        slogan: "Votre dose de fun est ici.",
        description:
          "Bonbons en forme de pilules, potions fluorescentes et gadgets médicaux amusants.",
        minimum_age: 1,
        duration: null,
        disabled_access: true,
        high_intensity: false,
        status: "published",
        image_url: "",
        category_id: categoriesKeys["Boutique"],
      },
    ],
  });

  console.log("activities inserted !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
