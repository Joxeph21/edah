export type NavChild = {
  label: string;
  path: string;
  type: "link";
};

export type NavItem = {
  label: string;
  path: string;
  type: "link" | "button";
  children?: NavChild[];
};



export const NAV_LINKS = [
  {
    label: "Art Shop",
    path: "/shop",
    type: "link",
  },
  {
    label: "Commissions",
    path: "/commissions",
    type: "link",
  },
  {
    label: "Portfolio",
    path: "/portfolio",
    type: "link",
  },
  {
    label: "About",
    // path: "/about",
    type: "button",

    children: [
      {
        label: "Bio / Artist Statement",
        path: "/biography",
        type: "link",
      },
      {
        label: "CV / Resume",
        path: "/resume",
        type: "link",
      },
    ],
  },
  {
    label: "Contact",
    path: "/contact",
    type: "link",
  },
];

export const BIO = {
  name: "Edah",

  bio: `Edah is a multidisciplinary fine artist based in Lagos, Nigeria. Born in Ogun and raised in Lagos Nigeria,
Edah’s love of storytelling began in childhood, evolving into a dedicated artistic practice. Fusing magical realism with Afro-surrealism to create a rich fictional world, he works primarily with oil and acrylics, occasionally designing surreal sculptures and 3D masks. His work stands as an art of sanctuary and deliberate slowness in a world consumed by hyper-acceleration and endless production. Rooted in an anti-capitalist ethos and a deep reverence for global indigenous ways of being, he paints Black figures to remind us of a fundamental truth: we are not separate from nature—we belong to it. Through character art and portraiture, his practice centers human existence detached from the demands of modern efficiency and constant performance. His pieces often explore themes of lost innocence, otherworldliness, and the longing to escape the constraints of modern life. By depicting figures in states of quiet solitude, rest, and ancestral presence, these visual spaces actively reject the mandate to constantly produce and consume.  
Ultimately, his paintings serve as gentle acts of resistance. They invite us to step outside the artificial urgency of modern society, reclaim our natural pace, and restore our sacred sense of belonging to the earth.

Get to know edah more here`,
};
