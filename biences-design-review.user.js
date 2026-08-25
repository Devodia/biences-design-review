// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      0.31.0
// @description  Revue visuelle du design system Biences (vocabulaire ATOMIQUE f-/s-/c-/m-/h-) : changer un axe, migrer un ancien cran, creer une taille. Rapport JSON pour Claude Code.
// @match        https://*.dev.odoo.com/*
// @match        https://*.biences.ch/*
// @downloadURL  https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @updateURL    https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==


/* Genere par gen_ds_catalog.py — SoT = ds/*.scss (europe-account). Ne pas editer a la main. */
window.BDR_CATALOG = {
  "_note": "Genere par gen_ds_catalog.py — SoT = ds/*.scss (europe-account). Ne pas editer a la main.",
  "version": 3,
  "nomenclature": "f-<fonte> s-<max>-<min>[-rampe] [c-<couleur>] [m-<mod>…] [h-<survol>]  (1rem=10px)",
  "source": "C:\\Users\\Manu\\Documents\\odoo\\github\\europe-account\\tb_theme_optimized\\static\\src\\sass\\ds",
  "axes": [
    {
      "key": "f",
      "label": "Fonte",
      "required": true,
      "multiple": false
    },
    {
      "key": "s",
      "label": "Taille",
      "required": true,
      "multiple": false
    },
    {
      "key": "c",
      "label": "Couleur",
      "required": false,
      "multiple": false
    },
    {
      "key": "m",
      "label": "Mod",
      "required": false,
      "multiple": true
    },
    {
      "key": "h",
      "label": "Survol",
      "required": false,
      "multiple": false
    }
  ],
  "atoms": {
    "f": [
      {
        "name": "f-body",
        "token": "--font-text",
        "decls": [
          [
            "",
            [
              [
                "font-family",
                "var(--font-text)"
              ]
            ]
          ]
        ],
        "label": "Texte",
        "file": "_atomes.scss"
      },
      {
        "name": "f-body-bold",
        "token": "--font-text-bold",
        "decls": [
          [
            "",
            [
              [
                "font-family",
                "var(--font-text-bold)"
              ]
            ]
          ]
        ],
        "label": "Texte gras",
        "file": "_atomes.scss"
      },
      {
        "name": "f-body-med",
        "token": "--font-text-medium",
        "decls": [
          [
            "",
            [
              [
                "font-family",
                "var(--font-text-medium)"
              ]
            ]
          ]
        ],
        "label": "Texte medium",
        "file": "_atomes.scss"
      },
      {
        "name": "f-title",
        "token": "--font-title",
        "decls": [
          [
            "",
            [
              [
                "letter-spacing",
                "0 !important"
              ],
              [
                "font-family",
                "var(--font-title)"
              ]
            ]
          ],
          [
            "em",
            [
              [
                "font-family",
                "var(--font-title-italic)"
              ],
              [
                "font-style",
                "initial"
              ],
              [
                "letter-spacing",
                "0 !important"
              ]
            ]
          ],
          [
            "*",
            [
              [
                "letter-spacing",
                "0 !important"
              ]
            ]
          ]
        ],
        "label": "Titre",
        "file": "_atomes.scss"
      },
      {
        "name": "f-title-it",
        "token": "--font-title-italic",
        "decls": [
          [
            "",
            [
              [
                "letter-spacing",
                "0 !important"
              ],
              [
                "font-family",
                "var(--font-title-italic)"
              ]
            ]
          ],
          [
            "em",
            [
              [
                "font-family",
                "var(--font-title-italic)"
              ],
              [
                "font-style",
                "initial"
              ],
              [
                "letter-spacing",
                "0 !important"
              ]
            ]
          ],
          [
            "*",
            [
              [
                "letter-spacing",
                "0 !important"
              ]
            ]
          ]
        ],
        "label": "Titre italique",
        "file": "_atomes.scss"
      }
    ],
    "s": [
      {
        "name": "s-10",
        "max": 10,
        "min": 10,
        "curve": "fixed",
        "px": 10.0,
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-12-11",
        "max": 12,
        "min": 11,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-12-9",
        "max": 12,
        "min": 9,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-13-10",
        "max": 13,
        "min": 10,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-14-11",
        "max": 14,
        "min": 11,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-14-12",
        "max": 14,
        "min": 12,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-15-12",
        "max": 15,
        "min": 12,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-16-13",
        "max": 16,
        "min": 13,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-17-14",
        "max": 17,
        "min": 14,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-18-15",
        "max": 18,
        "min": 15,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-18-16",
        "max": 18,
        "min": 16,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-24-21",
        "max": 24,
        "min": 21,
        "curve": "text",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-25-20-cta",
        "max": 25,
        "min": 20,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-30-24-cta",
        "max": 30,
        "min": 24,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-35-26-cta",
        "max": 35,
        "min": 26,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-40-33-cta",
        "max": 40,
        "min": 33,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-40-35-cta",
        "max": 40,
        "min": 35,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-54-35-cta",
        "max": 54,
        "min": 35,
        "curve": "cta",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-78-42-banner",
        "max": 78,
        "min": 42,
        "curve": "banner",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-78-42-title",
        "max": 78,
        "min": 42,
        "curve": "title",
        "label": null,
        "file": "_atomes.scss"
      },
      {
        "name": "s-9",
        "max": 9,
        "min": 9,
        "curve": "fixed",
        "px": 9.0,
        "label": null,
        "file": "_atomes.scss"
      }
    ],
    "c": [
      {
        "name": "c-default",
        "value": "var(--secondary-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--secondary-color)"
              ]
            ]
          ]
        ],
        "label": "Couleur par défaut",
        "file": "_atomes.scss"
      },
      {
        "name": "c-error",
        "value": "var(--error-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--error-color)"
              ]
            ]
          ]
        ],
        "label": "Erreur",
        "file": "_atomes.scss"
      },
      {
        "name": "c-important",
        "value": "var(--cta-important-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--cta-important-color)"
              ]
            ]
          ]
        ],
        "label": "Couleur d'accent",
        "file": "_atomes.scss"
      },
      {
        "name": "c-main",
        "value": "var(--primary-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--primary-color)"
              ]
            ]
          ]
        ],
        "label": "Couleur principale",
        "file": "_atomes.scss"
      },
      {
        "name": "c-muted",
        "value": "var(--light-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--light-color)"
              ]
            ]
          ]
        ],
        "label": "Atténué",
        "file": "_atomes.scss"
      },
      {
        "name": "c-ondark",
        "value": "white",
        "decls": [
          [
            "",
            [
              [
                "color",
                "white"
              ]
            ]
          ]
        ],
        "label": "Sur fond foncé",
        "file": "_atomes.scss"
      },
      {
        "name": "c-success",
        "value": "var(--success-color)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--success-color)"
              ]
            ]
          ]
        ],
        "label": "Succès",
        "file": "_atomes.scss"
      },
      {
        "name": "c-warning",
        "value": "var(--warning-color, #8A6D00)",
        "decls": [
          [
            "",
            [
              [
                "color",
                "var(--warning-color, #8A6D00)"
              ]
            ]
          ]
        ],
        "label": "Avertissement",
        "file": "_atomes.scss"
      }
    ],
    "m": [
      {
        "name": "m-caps",
        "decls": [
          [
            "",
            [
              [
                "text-transform",
                "uppercase"
              ]
            ]
          ]
        ],
        "label": "Capitales",
        "file": "_atomes.scss"
      },
      {
        "name": "m-caps-none",
        "decls": [
          [
            "",
            [
              [
                "text-transform",
                "none"
              ]
            ]
          ]
        ],
        "label": "Casse annulée",
        "file": "_atomes.scss"
      },
      {
        "name": "m-loose",
        "decls": [
          [
            "",
            [
              [
                "line-height",
                "1.5"
              ]
            ]
          ]
        ],
        "label": "Interligne aéré",
        "file": "_type_styles.scss"
      },
      {
        "name": "m-loose-more",
        "decls": [
          [
            "",
            [
              [
                "line-height",
                "1.75"
              ]
            ]
          ]
        ],
        "label": "Interligne très aéré",
        "file": "_type_styles.scss"
      },
      {
        "name": "m-strike",
        "decls": [
          [
            "",
            [
              [
                "text-decoration",
                "line-through"
              ]
            ]
          ]
        ],
        "label": "Barré",
        "file": "_type_styles.scss"
      },
      {
        "name": "m-tight",
        "decls": [
          [
            "",
            [
              [
                "line-height",
                "1"
              ]
            ]
          ]
        ],
        "label": "Interligne serré",
        "file": "_type_styles.scss"
      },
      {
        "name": "m-tight-more",
        "decls": [
          [
            "",
            [
              [
                "line-height",
                "0.9"
              ]
            ]
          ]
        ],
        "label": "Interligne très serré",
        "file": "_type_styles.scss"
      },
      {
        "name": "m-wide",
        "decls": [
          [
            "",
            [
              [
                "letter-spacing",
                "0.2em"
              ]
            ]
          ],
          [
            "*",
            [
              [
                "letter-spacing",
                "0.2em"
              ]
            ]
          ]
        ],
        "label": "Interlettrage large",
        "file": "_atomes.scss"
      }
    ],
    "h": [
      {
        "name": "h-color-important",
        "label": "Survol : couleur d'accent",
        "file": "_atomes.scss"
      },
      {
        "name": "h-color-main",
        "label": "Survol : couleur principale",
        "file": "_atomes.scss"
      }
    ]
  },
  "curves": {
    "title": {
      "fs": [
        {
          "div": 1.3,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.25,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.3,
          "k": 5,
          "mult": 1.0
        },
        {
          "div": 1.225,
          "k": 4,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.0
        }
      ],
      "lh": [
        {
          "div": 1.15,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.125,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.15,
          "k": 5,
          "mult": 1.01
        },
        {
          "div": 1.15,
          "k": 4,
          "mult": 1.02
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.04
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.06
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.08
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.1
        }
      ]
    },
    "cta": {
      "fs": [
        {
          "div": 1.225,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.1,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.1,
          "k": 5,
          "mult": 1.0
        },
        {
          "div": 1.1,
          "k": 4,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.0
        }
      ],
      "lh": [
        {
          "div": 1.2,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.03,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.05,
          "k": 5,
          "mult": 1.01
        },
        {
          "div": 1.07,
          "k": 4,
          "mult": 1.02
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.04
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.06
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.08
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.1
        }
      ]
    },
    "banner": {
      "fs": [
        {
          "div": 1.238,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.025,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.15,
          "k": 5,
          "mult": 1.0
        },
        {
          "div": 1.225,
          "k": 4,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.0
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.0
        }
      ],
      "lh": [
        {
          "div": 1.15,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.025,
          "k": 6,
          "mult": 1.0
        },
        {
          "div": 1.15,
          "k": 5,
          "mult": 1.01
        },
        {
          "div": 1.225,
          "k": 4,
          "mult": 1.02
        },
        {
          "div": 1.0,
          "k": 3,
          "mult": 1.04
        },
        {
          "div": 1.0,
          "k": 2,
          "mult": 1.06
        },
        {
          "div": 1.0,
          "k": 1,
          "mult": 1.08
        },
        {
          "div": 1.0,
          "k": 0,
          "mult": 1.1
        }
      ]
    }
  },
  "text_curve": {
    "fs": {
      "max": 1.0,
      "min": 1.0,
      "de": 361,
      "a": 1920
    },
    "lh": {
      "max": 1.32,
      "min": 1.21,
      "de": 361,
      "a": 1920
    },
    "min_rule_rem": 0.3
  },
  "min_rule": {
    "px": 3,
    "applies": [
      "text"
    ],
    "note": "TEXTE uniquement : les titres gardent leur min ecrit a l'appel"
  },
  "breakpoints": [
    361,
    510,
    768,
    1024,
    1366,
    1600,
    1920
  ],
  "legacy": {
    "body-12-9-caps-muted-wide": {
      "family": "body",
      "max": 12,
      "min": 9,
      "mods": [
        "caps",
        "muted",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-12-9",
        "c-muted",
        "m-caps",
        "m-wide"
      ]
    },
    "body-12-9-caps-wide": {
      "family": "body",
      "max": 12,
      "min": 9,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-12-9",
        "m-caps",
        "m-wide"
      ]
    },
    "body-12-9-muted": {
      "family": "body",
      "max": 12,
      "min": 9,
      "mods": [
        "muted"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-12-9",
        "c-muted"
      ]
    },
    "body-13-10-caps-accent-wide": {
      "family": "body",
      "max": 13,
      "min": 10,
      "mods": [
        "caps",
        "accent",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-13-10",
        "c-main",
        "m-caps",
        "m-wide"
      ]
    },
    "body-13-10-caps-wide": {
      "family": "body",
      "max": 13,
      "min": 10,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-13-10",
        "m-caps",
        "m-wide"
      ]
    },
    "body-13-10-wide": {
      "family": "body",
      "max": 13,
      "min": 10,
      "mods": [
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-13-10",
        "m-wide"
      ]
    },
    "body-14-11": {
      "family": "body",
      "max": 14,
      "min": 11,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-14-11"
      ]
    },
    "body-14-11-caps": {
      "family": "body",
      "max": 14,
      "min": 11,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-14-11",
        "m-caps"
      ]
    },
    "body-14-11-caps-wide": {
      "family": "body",
      "max": 14,
      "min": 11,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-14-11",
        "m-caps",
        "m-wide"
      ]
    },
    "body-14-11-muted": {
      "family": "body",
      "max": 14,
      "min": 11,
      "mods": [
        "muted"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-14-11",
        "c-muted"
      ]
    },
    "body-14-11-ondark": {
      "family": "body",
      "max": 14,
      "min": 11,
      "mods": [
        "ondark"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-14-11",
        "c-ondark"
      ]
    },
    "body-15-12": {
      "family": "body",
      "max": 15,
      "min": 12,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-15-12"
      ]
    },
    "body-16-13": {
      "family": "body",
      "max": 16,
      "min": 13,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-16-13"
      ]
    },
    "body-16-13-caps-muted-wide": {
      "family": "body",
      "max": 16,
      "min": 13,
      "mods": [
        "caps",
        "muted",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-16-13",
        "c-muted",
        "m-caps",
        "m-wide"
      ]
    },
    "body-16-13-caps-wide": {
      "family": "body",
      "max": 16,
      "min": 13,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-16-13",
        "m-caps",
        "m-wide"
      ]
    },
    "body-17-14": {
      "family": "body",
      "max": 17,
      "min": 14,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-17-14"
      ]
    },
    "body-17-14-caps-wide": {
      "family": "body",
      "max": 17,
      "min": 14,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-17-14",
        "m-caps",
        "m-wide"
      ]
    },
    "body-18-15-caps-wide": {
      "family": "body",
      "max": 18,
      "min": 15,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-18-15",
        "m-caps",
        "m-wide"
      ]
    },
    "body-24-21-caps": {
      "family": "body",
      "max": 24,
      "min": 21,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body",
        "s-24-21",
        "m-caps"
      ]
    },
    "body-bold-12-9-caps": {
      "family": "body-bold",
      "max": 12,
      "min": 9,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-12-9",
        "m-caps"
      ]
    },
    "body-bold-12-9-caps-wide": {
      "family": "body-bold",
      "max": 12,
      "min": 9,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-12-9",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-12-caps": {
      "family": "body-bold",
      "max": 12,
      "min": null,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-12-9",
        "m-caps"
      ]
    },
    "body-bold-13-10-caps-wide": {
      "family": "body-bold",
      "max": 13,
      "min": 10,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-13-10",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-13-10-caps-wide-muted": {
      "family": "body-bold",
      "max": 13,
      "min": 10,
      "mods": [
        "caps",
        "wide",
        "muted"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-13-10",
        "c-muted",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-14-11": {
      "family": "body-bold",
      "max": 14,
      "min": 11,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-14-11"
      ]
    },
    "body-bold-14-11-caps": {
      "family": "body-bold",
      "max": 14,
      "min": 11,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-14-11",
        "m-caps"
      ]
    },
    "body-bold-14-11-caps-wide": {
      "family": "body-bold",
      "max": 14,
      "min": 11,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-14-11",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-14-12-caps-wide": {
      "family": "body-bold",
      "max": 14,
      "min": 12,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-14-12",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-15-12-caps-ondark-wide": {
      "family": "body-bold",
      "max": 15,
      "min": 12,
      "mods": [
        "caps",
        "ondark",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-15-12",
        "c-ondark",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-15-caps": {
      "family": "body-bold",
      "max": 15,
      "min": null,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-15-12",
        "m-caps"
      ]
    },
    "body-bold-16-13": {
      "family": "body-bold",
      "max": 16,
      "min": 13,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-16-13"
      ]
    },
    "body-bold-16-13-caps-wide": {
      "family": "body-bold",
      "max": 16,
      "min": 13,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-16-13",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-16-13-wide": {
      "family": "body-bold",
      "max": 16,
      "min": 13,
      "mods": [
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-16-13",
        "m-wide"
      ]
    },
    "body-bold-18-15": {
      "family": "body-bold",
      "max": 18,
      "min": 15,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-18-15"
      ]
    },
    "body-bold-18-15-caps-wide": {
      "family": "body-bold",
      "max": 18,
      "min": 15,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-18-15",
        "m-caps",
        "m-wide"
      ]
    },
    "body-bold-18-16": {
      "family": "body-bold",
      "max": 18,
      "min": 16,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-bold",
        "s-18-16"
      ]
    },
    "body-bold-9-ondark": {
      "family": "body-bold",
      "max": 9,
      "min": 9,
      "mods": [
        "ondark"
      ],
      "curve": "fixed",
      "atoms": [
        "f-body-bold",
        "s-9",
        "c-ondark"
      ]
    },
    "body-med-10-caps-ondark-wide": {
      "family": "body-med",
      "max": 10,
      "min": 10,
      "mods": [
        "caps",
        "ondark",
        "wide"
      ],
      "curve": "fixed",
      "atoms": [
        "f-body-med",
        "s-10",
        "c-ondark",
        "m-caps",
        "m-wide"
      ]
    },
    "body-med-12-11-caps-ondark-wide": {
      "family": "body-med",
      "max": 12,
      "min": 11,
      "mods": [
        "caps",
        "ondark",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-12-11",
        "c-ondark",
        "m-caps",
        "m-wide"
      ]
    },
    "body-med-12-9": {
      "family": "body-med",
      "max": 12,
      "min": 9,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-12-9"
      ]
    },
    "body-med-12-9-caps": {
      "family": "body-med",
      "max": 12,
      "min": 9,
      "mods": [
        "caps"
      ],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-12-9",
        "m-caps"
      ]
    },
    "body-med-12-9-caps-wide": {
      "family": "body-med",
      "max": 12,
      "min": 9,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-12-9",
        "m-caps",
        "m-wide"
      ]
    },
    "body-med-14-11": {
      "family": "body-med",
      "max": 14,
      "min": 11,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-14-11"
      ]
    },
    "body-med-16-13": {
      "family": "body-med",
      "max": 16,
      "min": 13,
      "mods": [],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-16-13"
      ]
    },
    "body-med-16-13-caps-wide": {
      "family": "body-med",
      "max": 16,
      "min": 13,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-16-13",
        "m-caps",
        "m-wide"
      ]
    },
    "body-med-24-21-caps-wide": {
      "family": "body-med",
      "max": 24,
      "min": 21,
      "mods": [
        "caps",
        "wide"
      ],
      "curve": "text",
      "atoms": [
        "f-body-med",
        "s-24-21",
        "m-caps",
        "m-wide"
      ]
    },
    "title-30-24": {
      "family": "title",
      "max": 30,
      "min": 24,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title",
        "s-30-24-cta"
      ]
    },
    "title-40-35": {
      "family": "title",
      "max": 40,
      "min": 35,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title",
        "s-40-35-cta"
      ]
    },
    "title-54-35": {
      "family": "title",
      "max": 54,
      "min": 35,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title",
        "s-54-35-cta"
      ]
    },
    "title-78-42": {
      "family": "title",
      "max": 78,
      "min": 42,
      "mods": [],
      "curve": "title",
      "atoms": [
        "f-title",
        "s-78-42-title"
      ]
    },
    "title-78-42-banner": {
      "family": "title",
      "max": 78,
      "min": 42,
      "mods": [],
      "curve": "banner",
      "atoms": [
        "f-title",
        "s-78-42-banner"
      ]
    },
    "title-it-25-20": {
      "family": "title-it",
      "max": 25,
      "min": 20,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title-it",
        "s-25-20-cta"
      ]
    },
    "title-it-35-26": {
      "family": "title-it",
      "max": 35,
      "min": 26,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title-it",
        "s-35-26-cta"
      ]
    },
    "title-it-40-33": {
      "family": "title-it",
      "max": 40,
      "min": 33,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title-it",
        "s-40-33-cta"
      ]
    },
    "title-it-54-35": {
      "family": "title-it",
      "max": 54,
      "min": 35,
      "mods": [],
      "curve": "cta",
      "atoms": [
        "f-title-it",
        "s-54-35-cta"
      ]
    }
  },
  "roles": {
    "eyebrow": "body-18-15-caps-wide",
    "eyebrow-sm": "body-bold-13-10-caps-wide",
    "price-base": "body-12-9-caps-wide",
    "price-discount": "body-14-11",
    "price-strike": "body-14-11-ondark",
    "product-name": "body-14-11-caps"
  },
  "components": {
    "Animation": [
      "bnc-pulse"
    ],
    "Composants": [
      "add-to-cart-link",
      "add-to-cart-pill",
      "af-strength",
      "bi-price",
      "cart_side_panel_totals",
      "checkout_recap_body",
      "checkout_recap_line",
      "checkout_recap_lines",
      "checkout_recap_title",
      "checkout_savings_pill",
      "link-back-style",
      "price-discount-pill",
      "price-fake-discount",
      "recap_pied",
      "recap_pied_icone",
      "recap_pied_icone_slot",
      "recap_pied_logo",
      "recap_pied_marque",
      "recap_pied_txt",
      "recap_pied_val",
      "recap_total_montant",
      "recap_totaux_bloc",
      "recap_totaux_fond",
      "unavailable-cta",
      "unavailable-cta-compact"
    ],
    "Composants (socle)": [
      "cta-accent",
      "cta-button",
      "cta-outline",
      "cta-plain",
      "cta-primary",
      "cta-secondary",
      "cta-text",
      "link-accent-sm",
      "link-underline"
    ],
    "Formulaire d'avis": [
      "rfi-edit-image-add",
      "rfi-edit-image-add-plus",
      "rfi-edit-image-add-text",
      "rfi-edit-image-item",
      "rfi-edit-image-list",
      "rfi-edit-image-msg",
      "rfi-edit-image-remove",
      "rfi-pb-pill",
      "rfi-pb-pills",
      "rfi-pills",
      "rfi-star",
      "rfi-star-label",
      "rfi-stars",
      "rfi-upload-btn",
      "rfi-upload-caps",
      "rfi-upload-icon",
      "rfi-upload-preview",
      "rfi-upload-wrap"
    ],
    "Tunnel — étapes": [
      "bnc-step",
      "bnc-step-node",
      "bnc-step-rail-fill",
      "bnc-stepper"
    ]
  },
  "utils": [],
  "aliases": {
    "add-to-cart-11-style": "add-to-cart-link",
    "add-to-cart-12-style": "add-to-cart-pill",
    "add-to-cart-style": "add-to-cart-link",
    "cart-offer-title-style": "body-med-16-13-caps-wide",
    "cta-1-style": "cta-primary",
    "cta-2-style": "cta-outline",
    "cta-3-style": "cta-secondary",
    "cta-4-style": "cta-plain",
    "cta-important-style": "cta-accent",
    "cta-negative-style": "cta-primary",
    "default-style": "body-17-14",
    "font1-bold-title-style": "body-bold-16-14-caps-wide",
    "font1-medium-slogan-style": "body-med-24-14-caps-wide",
    "font1-medium-title-style": "body-med-16-13-caps-wide",
    "font2-big-title-style": "title-78-42",
    "font2-cta-slogan-style": "title-54-31",
    "font2-slideshow-slogan-style": "title-78-42-banner",
    "font2-small-italic-title-style": "title-it-40-33",
    "font2-small-smaller-title-style": "title-30-24",
    "font2-small-title-style": "title-40-35",
    "font2-text-italic-style": "title-it-35-26",
    "font2-title-italic-style": "title-it-54-35",
    "font2-title-style": "title-54-35",
    "footer-address-style": "body-13-10-wide",
    "footer-copyright-style": "body-bold-15-12-caps-ondark-wide",
    "footer-link-hover-style": "footer-link",
    "footer-links-title-style": "body-bold-13-10-caps-wide",
    "form-label-checkbox-style": "body-bold-16-14",
    "form-label-style": "body-bold-16-14",
    "heavy-subtitle-uppercase-style": "body-bold-18-14",
    "hover-main-color": "u-accent-hover",
    "lato-medium-slogan-style": "body-med-24-14-caps-wide",
    "lato-mediun-title-style": "body-med-16-13-caps-wide",
    "light-subtitle-style": "body-14-11-muted",
    "main-color": "u-accent",
    "mc-hover": "u-accent-hover-soft",
    "menu-bottom-link-style": "menu-link-bottom",
    "menu-cart-qty-style": "body-bold-9-ondark",
    "menu-link-hover-style": "menu-link-hover",
    "menu-link-mc-style": "menu-link-static",
    "menu-link-style": "menu-link",
    "menu-post-title-style": "body-18-12-caps-wide",
    "menu-promo-bar-style": "body-med-10-caps-ondark-wide",
    "menu-responsive-lang-link-style": "menu-link-lang",
    "menu-responsive-link-style": "menu-link-mobile",
    "menu-responsive-search-placeholder-style": "body-17-14-caps-wide",
    "menu-responsive-search-style": "menu-search-input",
    "menu-sub-link-style": "menu-link-sub",
    "menu-top-link-style": "menu-link-top",
    "ppp-style": "body-16-13-caps-wide",
    "price-base-strike": "price-base u-strike",
    "product-inci-style": "u-caps",
    "product-instead-style": "body-16-13",
    "product-name-style": "body-14-11-caps",
    "product-score-style": "body-14-11",
    "product-step-mc-style": "body-bold-18-15-caps-wide",
    "product-step-style": "body-bold-16-12-caps-wide",
    "promoted-product-name-style": "body-24-21-caps",
    "select-style": "body-14-11",
    "sherborne-cta-slogan-style": "title-54-31",
    "sherborne-slideshow-slogan-style": "title-78-42-banner",
    "sherborne-title-style": "title-54-35",
    "shop-product-base-price-style": "price-base u-strike",
    "shop-product-description-style": "body-15-12",
    "shop-product-discount-style": "price-discount-pill",
    "shop-product-fake-discount-style": "price-fake-discount",
    "shop-product-price-style": "body-16-13-caps-wide",
    "shop-product-title-style": "body-bold-16-12-caps-wide",
    "small-text-style": "body-12-9-muted",
    "text-bold-style": "body-bold-18-14",
    "text-none": "u-caps-none",
    "text-style": "body-17-14",
    "text-uppercase": "u-caps",
    "unavailable-2-style": "unavailable-cta-compact",
    "unavailable-style": "unavailable-cta"
  }
};

/* ==========================================================================
 * BDR — moteur du DS ATOMIQUE (pur, sans DOM)
 *
 * Le vocabulaire se COMPOSE (decision Manuel du 23.08.2026) : au lieu d'un
 * cran par combinaison, une classe par nature.
 *
 *     body-bold-16-13-caps-wide  ->  f-body-bold s-16-13 m-caps m-wide
 *     title-54-35                ->  f-title s-54-35-cta
 *
 * Ce que le moteur sait faire :
 *   - lire une liste de classes et la ranger par AXE (f / s / c / m / h) ;
 *   - reconnaitre un cran monolithique (la PRODUCTION en est encore faite) et
 *     donner sa traduction en atomes ;
 *   - calculer la taille SERVIE, fidele aux mixins d'aujourd'hui ;
 *   - synthetiser le CSS d'un atome de taille qui n'existe pas encore.
 *
 * 🔴 LA MATH DES TAILLES A CHANGE LE 17.08.2026, ET C'EST LE PIEGE DE CE
 * FICHIER. Les quatre mixins posaient un DIVISEUR sur leur palier bas ; il a
 * ete retire parce que le min annonce par le nom n'etait servi a aucune
 * largeur. Depuis :
 *   - `font-size-text` n'est plus un escalier du tout, c'est un `clamp()`
 *     continu entre 361 et 1920 px ;
 *   - `cta` / `title` / `banner` gardent leurs huit paliers, mais RECALES par
 *     une transformation affine sur [min, max] : la forme de la courbe est
 *     conservee, les deux extremites atterrissent pile sur les bornes du nom.
 * Les coefficients ne sont donc PAS ecrits ici : ils sont extraits du SCSS par
 * `gen_ds_catalog.py` et vivent dans le catalogue. Un mixin qui bouge, un
 * `gen` a relancer, et le moteur suit. C'est exactement ce qui a manque : la
 * version precedente appliquait encore les diviseurs un mois apres.
 *
 * Teste sous node contre le CSS REELLEMENT COMPILE PAR SASS
 * (`fixtures/sass_compile.json`, extrait de `biences_product.css`). Un test
 * qui compare le moteur a lui-meme ne peut pas echouer ; celui-la le peut.
 * ========================================================================== */
(function (root) {
  'use strict';

  var MQ = [0, 361, 510, 768, 1024, 1366, 1600, 1920];

  /* Sass arrondit a 10 decimales et coupe les zeros de fin. On rend le meme
   * nombre, sinon la comparaison au CSS compile echoue sur du bruit flottant. */
  function sassNum(x) {
    var v = Math.round(x * 1e10) / 1e10;
    var s = v.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function r6(x) { return Math.round(x * 1e6) / 1e6; }

  function makeEngine(CAT) {
    var AX = {};
    (CAT.axes || []).forEach(function (a) { AX[a.key] = a; });

    // index des atomes par nom et par axe
    var atomByName = {}, atomsOf = {};
    Object.keys(CAT.atoms || {}).forEach(function (axis) {
      atomsOf[axis] = CAT.atoms[axis] || [];
      atomsOf[axis].forEach(function (a) {
        a.axis = axis;
        atomByName[a.name] = a;
      });
    });
    var legacyMap = CAT.legacy || {};
    var roleMap = CAT.roles || {};
    var aliasMap = CAT.aliases || {};
    var utilSet = {}; (CAT.utils || []).forEach(function (n) { utilSet[n] = true; });
    var compSet = {};
    Object.keys(CAT.components || {}).forEach(function (g) {
      CAT.components[g].forEach(function (n) { compSet[n] = g; });
    });
    var minPx = (CAT.min_rule && CAT.min_rule.px) || 3;

    // ── taille : les deux regimes ───────────────────────────────────────────

    /* `font-size-text` : une rampe continue. Rend les termes du `clamp()`,
     * en rem, tels que sass les ecrit. */
    function clampTerms(max, min, coefMax, coefMin, de, a) {
      var hi = max * coefMax, lo = min * coefMin;
      if (hi === lo) return { fixe: hi };
      return { lo: lo, hi: hi, pente: (hi - lo) * 10, de: de, a: a };
    }
    function textTerms(max, min) {
      var tc = CAT.text_curve;
      max = max / 10; min = min / 10;      // le nom porte des px, le mixin des rem
      return {
        fs: clampTerms(max, min, tc.fs.max, tc.fs.min, tc.fs.de, tc.fs.a),
        lh: clampTerms(max, min, tc.lh.max, tc.lh.min, tc.lh.de, tc.lh.a)
      };
    }
    function clampCSS(t) {
      if (t.fixe !== undefined) return sassNum(t.fixe) + 'rem';
      return 'clamp(' + sassNum(t.lo) + 'rem, ' + sassNum(t.lo) + 'rem + ' +
        sassNum(t.pente) + ' * (100vw - ' + t.de + 'px) / ' + (t.a - t.de) +
        ', ' + sassNum(t.hi) + 'rem)';
    }
    function clampAt(t, vw) {
      if (t.fixe !== undefined) return t.fixe;
      var v = t.lo + t.pente / 10 * (vw - t.de) / (t.a - t.de);
      return Math.min(t.hi, Math.max(t.lo, v));
    }

    /* `cta` / `title` / `banner` : huit paliers, recales en affine sur
     * [min, max]. `servi(k) = min + (o(k) - o(0)) * (max - min) / (o(7) - o(0))`,
     * et l'interligne suit par le RATIO l(k)/o(k) du mixin d'origine. */
    function ladderLevels(curve, max, min) {
      var c = CAT.curves[curve];
      if (!c) return null;
      max = max / 10; min = min / 10;
      var step = (max - min) / 6;
      function ev(co) { return (max / co.div - step * co.k) * co.mult; }
      var o = c.fs.map(ev), l = c.lh.map(ev);
      var k = (max - min) / (o[7] - o[0]);
      var out = [];
      for (var i = 0; i < 8; i++) {
        var fs = (i === 7) ? max : min + (o[i] - o[0]) * k;
        out.push({ mq: MQ[i], fs: fs, lh: fs * (l[i] / o[i]) });
      }
      return out;
    }

    /* Rend la description complete d'une taille, quel que soit son regime. */
    function sizeSpec(curve, max, min) {
      if (curve === 'fixed') return { kind: 'fixed', px: max };
      if (curve === 'text') return { kind: 'clamp', terms: textTerms(max, min) };
      return { kind: 'ladder', levels: ladderLevels(curve, max, min) };
    }
    function levelIndexFor(vw) {
      var idx = 0;
      for (var i = 0; i < MQ.length; i++) if (vw >= MQ[i]) idx = i;
      return idx;
    }
    /* Taille servie a une largeur, en PX. */
    function sizeAt(curve, max, min, vw) {
      var sp = sizeSpec(curve, max, min);
      if (sp.kind === 'fixed') return sp.px;
      if (sp.kind === 'clamp') return r6(clampAt(sp.terms.fs, vw) * 10);
      return r6(sp.levels[levelIndexFor(vw)].fs * 10);
    }

    // ── la regle du min ─────────────────────────────────────────────────────
    // TEXTE uniquement : `min = max - 3`. Les titres gardent le min ecrit a
    // l'appel (decision Manuel du 22.08.2026, « je veux pas que tu changes les
    // title »), le builder ne doit donc pas le deduire pour eux.
    function minDuCran(max, curve) {
      return (curve || 'text') === 'text' ? max - minPx : null;
    }

    // ── noms d'atomes de taille ─────────────────────────────────────────────
    function sizeAtomName(max, min, curve) {
      curve = curve || 'text';
      if (curve === 'fixed' || min == null || +min === +max) return 's-' + max;
      return 's-' + max + '-' + min + (curve === 'text' ? '' : '-' + curve);
    }
    function findSize(max, min, curve) {
      curve = curve || 'text';
      for (var i = 0; i < (atomsOf.s || []).length; i++) {
        var a = atomsOf.s[i];
        if (a.curve === curve && a.max === +max && a.min === +min) return a;
      }
      return null;
    }
    function sizesByCurve(curve) {
      return (atomsOf.s || []).filter(function (a) { return a.curve === curve; });
    }

    // ── lecture d'un nom ────────────────────────────────────────────────────
    function parseAtom(name) {
      return atomByName[name] || null;
    }
    /* Un nom de taille jamais defini mais bien forme : le builder peut le creer. */
    function parseSizeName(name) {
      var m = /^s-(\d+)(?:-(\d+))?(?:-(cta|title|banner))?$/.exec(name);
      if (!m) return null;
      var curve = m[3] || (m[2] ? 'text' : 'fixed');
      return {
        name: name, axis: 's', curve: curve,
        max: +m[1], min: m[2] ? +m[2] : +m[1]
      };
    }
    function legacyToAtoms(name) {
      var l = legacyMap[name];
      return (l && l.atoms) ? l.atoms.slice() : null;
    }

    function resolve(name) {
      if (atomByName[name]) {
        return { name: name, category: 'atom', axis: atomByName[name].axis,
                 atom: atomByName[name], atoms: [name] };
      }
      if (legacyMap[name]) {
        return { name: name, category: 'legacy', legacy: legacyMap[name],
                 atoms: legacyToAtoms(name) };
      }
      if (roleMap[name]) {
        var tgt = roleMap[name];
        return { name: name, category: 'role', canonical: tgt,
                 atoms: atomByName[tgt] ? [tgt] : legacyToAtoms(tgt) };
      }
      if (compSet[name]) {
        return { name: name, category: 'component', group: compSet[name], atoms: null };
      }
      if (utilSet[name]) return { name: name, category: 'util', atoms: [name] };
      if (aliasMap[name]) {
        var toks = String(aliasMap[name]).split(/\s+/);
        var out = [];
        toks.forEach(function (t) {
          var r = resolve(t);
          if (r.atoms) out = out.concat(r.atoms); else out.push(t);
        });
        return { name: name, category: 'alias', canonical: aliasMap[name], atoms: out };
      }
      var sz = parseSizeName(name);
      if (sz) return { name: name, category: 'buildable', axis: 's', atom: sz, atoms: [name] };
      return { name: name, category: 'unknown', atoms: null };
    }
    function isDS(name) { return resolve(name).category !== 'unknown'; }

    /* Range une liste de classes par axe. C'est la lecture dont l'interface a
     * besoin : un element ne porte plus UNE classe DS mais une composition, et
     * peut porter en plus un cran d'avant sur la production. */
    function readClasses(list) {
      var out = { f: null, s: null, c: null, m: [], h: null,
                  legacy: [], components: [], roles: [], aliases: [],
                  utils: [], unknown: [], ds: [] };
      (list || []).forEach(function (n) {
        if (!n) return;
        var r = resolve(n);
        if (r.category === 'atom') {
          out.ds.push(n);
          if (AX[r.axis] && AX[r.axis].multiple) out[r.axis].push(n);
          else out[r.axis] = n;
        } else if (r.category === 'legacy') { out.ds.push(n); out.legacy.push(n); }
        else if (r.category === 'role') { out.ds.push(n); out.roles.push(n); }
        else if (r.category === 'component') { out.ds.push(n); out.components.push(n); }
        else if (r.category === 'alias') { out.ds.push(n); out.aliases.push(n); }
        else if (r.category === 'util') { out.ds.push(n); out.utils.push(n); }
        else out.unknown.push(n);
      });
      return out;
    }

    /* Ce que l'element DEVRAIT porter : ses atomes, crans traduits compris.
     * Sert au bandeau « a migrer » et a la proposition automatique. */
    function atomsFor(list) {
      var seen = {}, out = [];
      (list || []).forEach(function (n) {
        var a = resolve(n).atoms;
        if (!a) return;
        a.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
      });
      return out;
    }

    /* Une composition est-elle complete ? `f-` et `s-` sont requis : un texte
     * sans atome de taille retombe sur ce que son parent lui donne. */
    function missingAxes(read) {
      return (CAT.axes || []).filter(function (a) {
        return a.required && !(a.multiple ? read[a.key].length : read[a.key]);
      }).map(function (a) { return a.key; });
    }

    // ── synthese CSS d'un atome de taille neuf ──────────────────────────────
    function synthSizeCSS(name, max, min, curve, important) {
      var imp = important ? ' !important' : '';
      var sp = sizeSpec(curve, max, min);
      if (sp.kind === 'fixed') {
        return '.' + name + '{font-size:' + max + 'px' + imp + ';}';
      }
      if (sp.kind === 'clamp') {
        return '.' + name + '{font-size:' + clampCSS(sp.terms.fs) + imp +
          ';line-height:' + clampCSS(sp.terms.lh) + imp + ';}';
      }
      var lv = sp.levels;
      var css = '.' + name + '{font-size:' + sassNum(lv[0].fs) + 'rem' + imp +
        ';line-height:' + sassNum(lv[0].lh) + 'rem' + imp + ';}';
      for (var i = 1; i < 8; i++) {
        css += '@media(min-width:' + MQ[i] + 'px){.' + name +
          '{font-size:' + sassNum(lv[i].fs) + 'rem' + imp +
          ';line-height:' + sassNum(lv[i].lh) + 'rem' + imp + ';}}';
      }
      return css;
    }

    /* CSS d'un atome QUELCONQUE, pour le rejouer la ou il n'existe pas.
     * C'est le cas de la PRODUCTION : aucun `f-` / `s-` / `c-` / `m-` n'y est
     * servi. Sans ca, changer un axe sur biences.ch ne peindrait rien et
     * l'outil dirait le contraire de ce que l'ecran montre.
     * Les tailles passent par la math ; les autres axes rendent les
     * declarations que le DS ecrit, `var(--x)` compris — elles sont valides
     * telles quelles sur les deux sites. */
    function synthAtomCSS(name, important) {
      var a = atomByName[name] || parseSizeName(name);
      if (!a) return null;
      if (a.axis === 's' || /^s-/.test(name)) {
        return synthSizeCSS(name, a.max, a.min, a.curve, important);
      }
      var imp = important ? ' !important' : '';
      var css = '';
      (a.decls || []).forEach(function (bloc) {
        var sel = '.' + name + (bloc[0] ? ' ' + bloc[0] : '');
        var d = bloc[1].map(function (kv) {
          return kv[0] + ':' + String(kv[1]).replace(/\s*!important\s*$/, '') + imp;
        }).join(';');
        if (d) css += sel + '{' + d + ';}';
      });
      return css || null;
    }

    /* Le SCSS a coller dans `ds/_atomes.scss` : c'est ce qui part au rapport,
     * pas le CSS synthetise. Le CSS sert a VOIR, le SCSS a POSER. */
    function scssForSize(name, max, min, curve) {
      if (curve === 'fixed') return '.' + name + ' { font-size: ' + max + 'px; }';
      var args = (max / 10) + ', ' + (min / 10);
      if (curve === 'text' && min === max - minPx) args = String(max / 10);
      return '.' + name + ' { @include font-size-' + curve + '(' + args + '); }';
    }

    return {
      CAT: CAT, MQ: MQ, minPx: minPx,
      sassNum: sassNum,
      atomsOf: atomsOf, atomByName: atomByName,
      parseAtom: parseAtom, parseSizeName: parseSizeName,
      resolve: resolve, isDS: isDS, readClasses: readClasses, atomsFor: atomsFor,
      missingAxes: missingAxes, legacyToAtoms: legacyToAtoms,
      sizeSpec: sizeSpec, sizeAt: sizeAt, levelIndexFor: levelIndexFor,
      ladderLevels: ladderLevels, textTerms: textTerms, clampCSS: clampCSS,
      minDuCran: minDuCran, sizeAtomName: sizeAtomName, findSize: findSize,
      sizesByCurve: sizesByCurve,
      synthSizeCSS: synthSizeCSS, synthAtomCSS: synthAtomCSS, scssForSize: scssForSize
    };
  }

  root.BDR_makeEngine = makeEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = { makeEngine: makeEngine };
})(typeof window !== 'undefined' ? window : globalThis);


/* ==========================================================================
 * Biences Design Review — UI
 * --------------------------------------------------------------------------
 * Parcours Eliott : VISITER une page -> la REVIEWER visuellement -> RAPPORT
 * (JSON consomme par Claude Code). Rapport persiste cross-page (localStorage)
 * et s'accumule sur tout le site ; export unique a la fin.
 *
 * 🔴 LE DS S'ECRIT PAR ATOMES DEPUIS LE 23.08.2026, et c'est ce qui change le
 * geste de revue. Un element ne porte plus UN style mais une COMPOSITION :
 *
 *     f-body-bold  s-16-13  c-muted  m-caps  m-wide
 *      la fonte     taille   couleur    les mods
 *
 * On ne remplace donc plus un nom par un autre : on change UN AXE et on laisse
 * les autres en place. Le panneau montre une ligne par axe, et « creer un
 * style » est devenu « creer une TAILLE » (les autres axes sont clos).
 *
 * Les deux mondes cohabitent le temps de la bascule : la PRODUCTION est encore
 * ecrite en crans monolithiques (`body-bold-16-13-caps-wide`). Ils sont
 * reconnus, marques « a migrer », et l'outil sait proposer leur traduction.
 * ========================================================================== */
(async function () {
  'use strict';

  if (window.__bdr) { window.__bdr.toggle(); return; }   // re-injection = toggle

  var CAT = window.BDR_CATALOG;
  var E = window.BDR_makeEngine(CAT);
  var Z = 2147483000;
  var STORE = 'bdr_report_v1';     // rapport accumule cross-page

  /* ---- state -------------------------------------------------------------- */
  var feedbacks = [];
  var createdStyles = {};          // name -> css synthetise (commite, va au rapport)
  var reviewMode = false;
  var selected = null;
  var selPath = null;
  var lastStack = [];
  var stackScroll = 0;             // position de scroll de la boite hierarchie (preservee au re-render)
  var TOKENS = {};
  var FONTS = {};                  // police resolue -> { token, famille }
  var colors = { text: '#1c1c1c', muted: '#8a8a8a', accent: '#e87722' };
  var multiGroup = null;
  var showAfter = false;
  var pausedShowAfter = false;     // etat avant/apres a restaurer a la reprise (la pause rend la page neutre)
  var pageLocked = false;
  var newStyleSheet = null;
  var injectedCSS = {};
  var dynCleanup = null;
  var view = 'review';             // 'review' | 'report'

  // registre avant/apres (par page, refs DOM vivantes)
  var touchedEls = [];
  var beforeOf = new Map();
  var afterOf = new Map();
  var fbEls = new Map();           // feedback -> [els], pour defaire au retrait

  /* ---- persistance -------------------------------------------------------- */
  function saveReport() {
    try { localStorage.setItem(STORE, JSON.stringify({ feedbacks: feedbacks, created: createdStyles })); } catch (e) {}
  }
  function loadReport() {
    try {
      var d = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (d) { if (d.feedbacks) feedbacks = d.feedbacks; if (d.created) createdStyles = d.created; }
    } catch (e) {}
  }
  function clearReport() {
    applyBA(false);
    touchedEls = []; beforeOf = new Map(); afterOf = new Map(); fbEls = new Map(); showAfter = false;
    feedbacks.length = 0; createdStyles = {};
    try { localStorage.removeItem(STORE); } catch (e) {}
    renderTray();
  }
  // retirer une modif : defait le changement sur ses elements + oublie son avant/apres
  function removeFeedback(i) {
    var fb = feedbacks[i], els = fbEls.get(fb);
    if (els) { els.forEach(function (el) {
      if (beforeOf.has(el)) { el.setAttribute('class', beforeOf.get(el)); el.removeAttribute('data-bdr-v'); var t = touchedEls.indexOf(el); if (t >= 0) touchedEls.splice(t, 1); beforeOf.delete(el); afterOf.delete(el); }
    }); fbEls.delete(fb); }
    feedbacks.splice(i, 1); saveReport(); renderTray();
  }

  /* ---- helpers DOM -------------------------------------------------------- */
  function h(tag, props) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      if (k === 'class') e.className = props[k];
      else if (k === 'html') e.innerHTML = props[k];
      else if (k === 'text') e.textContent = props[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), props[k]);
      else e.setAttribute(k, props[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c == null) continue;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return e;
  }
  var classAttr = function (el) { return el.getAttribute('class') || ''; };
  var breakpoint = function () { return innerWidth < 768 ? 'mobile' : innerWidth < 1024 ? 'tablet' : 'desktop'; };
  function chip(name, col) { return h('span', { class: 'bdr-chip', style: 'background:' + col + '22;color:' + col, text: name }); }
  function inField() { var a = document.activeElement; return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable); }

  var hovBox = h('div', { id: 'bdr-hovbox' });
  var selBox = h('div', { id: 'bdr-selbox' });
  var multiLayer = h('div', { id: 'bdr-multilayer' });
  function boxAt(box, el) {
    if (!el) { box.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = r.left + 'px'; box.style.top = r.top + 'px';
    box.style.width = r.width + 'px'; box.style.height = r.height + 'px';
  }

  /* ---- detection DS (moteur) --------------------------------------------- */
  function dsClassesOf(el) {
    var out = [];
    var cls = classAttr(el).trim();
    if (!cls) return out;
    cls.split(/\s+/).forEach(function (c) {
      var r = E.resolve(c);
      if (r.category !== 'unknown' && r.category !== 'buildable') out.push(r);
    });
    return out;
  }
  function hasStyle(el) { return el.nodeType === 1 && dsClassesOf(el).length > 0; }
  function nearestStyled(el) {
    var n = el;
    while (n && n.nodeType === 1) {
      if (n.closest && n.closest('#bdr-root')) return null;
      if (hasStyle(n)) return n;
      n = n.parentElement;
    }
    return null;
  }
  // Trois etats. `legacy` est revenu, et c'est le coeur de la revue pendant la
  // bascule : l'element porte encore un cran monolithique, ou un ancien nom.
  // La production en est entierement faite, le banc `europe-account` n'en a
  // presque plus (2 poses au 25.08).
  function classify(el) {
    var ds = dsClassesOf(el);
    var vieux = ds.some(function (r) {
      return r.category === 'legacy' || r.category === 'alias' || r.category === 'role';
    });
    return { state: ds.length ? (vieux ? 'legacy' : 'ds') : 'plain', ds: ds };
  }
  function styled(state) { return state === 'ds' || state === 'legacy'; }
  function canonOf(r) { return r.canonical || r.name; }
  // la composition portee par l'element, rangee par axe
  function readEl(el) { return E.readClasses(classAttr(el).trim().split(/\s+/).filter(Boolean)); }

  /* ---- ressource (image / icone / fond) ---------------------------------- */
  function resourceOf(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.tagName === 'IMG' && el.getAttribute('src')) return el.getAttribute('src');
    var use = el.tagName.toLowerCase() === 'svg' ? el.querySelector('use') : (el.tagName.toLowerCase() === 'use' ? el : null);
    if (use) { var href = use.getAttribute('href') || use.getAttribute('xlink:href'); if (href) return href; }
    try {
      var bg = getComputedStyle(el).backgroundImage;
      var m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) return m[1];
    } catch (e) {}
    var img = el.querySelector && el.querySelector('img[src], use[href], use[xlink\\:href]');
    if (img) return img.getAttribute('src') || img.getAttribute('href') || img.getAttribute('xlink:href');
    return null;
  }

  /* ---- ancrage / description --------------------------------------------- */
  function describe(el) {
    var parts = []; var n = el;
    while (n && n.nodeType === 1 && !(n.closest && n.closest('#bdr-root'))) {
      if (n.id) { parts.unshift('#' + CSS.escape(n.id)); break; }
      var seg = n.tagName.toLowerCase();
      var p = n.parentElement;
      if (p) {
        var same = Array.prototype.filter.call(p.children, function (c) { return c.tagName === n.tagName; });
        if (same.length > 1) seg += ':nth-of-type(' + (same.indexOf(n) + 1) + ')';
      }
      parts.unshift(seg); n = n.parentElement;
    }
    var a = el, id = '';
    while (a && a.nodeType === 1 && !(a.closest && a.closest('#bdr-root'))) { if (a.id) { id = a.id; break; } a = a.parentElement; }
    var open = '<' + el.tagName.toLowerCase();
    Array.prototype.forEach.call(el.attributes, function (at) {
      if (at.name === 'style' || at.name.indexOf('data-bdr') === 0) return;
      open += ' ' + at.name + (at.value ? '="' + at.value + '"' : '');
    });
    open += '>';
    if (open.length > 240) open = open.slice(0, 240) + '…';
    var r = el.getBoundingClientRect();
    return {
      css_path: parts.join(' > '), id: id, open_tag: open,
      classes_all: classAttr(el).trim().split(/\s+/).filter(Boolean),
      text_anchor: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      tag: el.tagName.toLowerCase(), resource: resourceOf(el),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
    };
  }

  /* ---- couleurs / tokens (robuste prod + staging) ------------------------ */
  function rawToRgb(raw, probe) {
    probe.style.color = ''; probe.style.color = raw;
    if (!probe.style.color) return null;
    var rgb = getComputedStyle(probe).color;
    return (rgb && rgb !== 'rgba(0, 0, 0, 0)') ? rgb : null;
  }
  function resolveColors() {
    var probe = h('span', { style: 'position:absolute;opacity:0;pointer-events:none;left:-9999px;' });
    document.body.appendChild(probe);
    colors.text = getComputedStyle(document.body).color || '#1c1c1c';
    function viaToken(names) {
      for (var i = 0; i < names.length; i++) {
        var raw = getComputedStyle(document.documentElement).getPropertyValue(names[i]).trim();
        if (raw) { var rgb = rawToRgb(raw, probe); if (rgb) return rgb; }
      }
      return null;
    }
    function viaClass(classes) {   // accepte seulement si distinct du texte (=> la classe existe)
      for (var i = 0; i < classes.length; i++) {
        probe.className = classes[i];
        var col = getComputedStyle(probe).color;
        probe.className = '';
        if (col && col !== 'rgba(0, 0, 0, 0)' && col !== colors.text) return col;
      }
      return null;
    }
    colors.accent = viaToken(['--primary-color', '--main-color', '--color-primary', '--accent-color'])
      || viaClass(['c-main', 'u-accent', 'main-color']) || '#e87722';
    colors.muted = viaToken(['--light-color', '--text-light', '--color-light', '--muted-color'])
      || viaClass(['c-muted', 'body-14-11-muted', 'light-subtitle-style']) || '#8a8a8a';
    probe.remove();
  }
  // police reelle -> atome de fonte. La police EST une variable CSS
  // (`--font-text` = lato = `f-body`), donc lisible sur les deux sites.
  function buildFonts() {
    (E.atomsOf.f || []).forEach(function (f) {
      if (!f.token) return;
      var raw = getComputedStyle(document.documentElement).getPropertyValue(f.token).trim();
      if (!raw) return;
      var first = raw.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
      if (first && !(first in FONTS)) FONTS[first] = { token: f.token, label: f.name };
    });
  }
  function buildTokens() {
    var probe = h('span', { style: 'position:absolute;opacity:0;pointer-events:none' });
    document.body.appendChild(probe);
    var names = new Set();
    for (var s = 0; s < document.styleSheets.length; s++) {
      var rules; try { rules = document.styleSheets[s].cssRules; } catch (e) { continue; }
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)) {
          for (var j = 0; j < r.style.length; j++) { var p = r.style[j]; if (p.indexOf('--') === 0) names.add(p); }
        }
      }
    }
    names.forEach(function (name) {
      var raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (!raw) return;
      probe.style.color = ''; probe.style.color = raw;
      if (!probe.style.color) return;
      var rgb = getComputedStyle(probe).color;
      if (rgb && rgb !== 'rgba(0, 0, 0, 0)' && !(rgb in TOKENS)) TOKENS[rgb] = name;
    });
    probe.remove();
  }

  function propsBlock(el) {
    var cs = getComputedStyle(el);
    var rows = [];
    function plain(label, v) { if (v && v !== 'normal' && v !== '0px') rows.push([label, v, null]); }
    var ownC = cs.backgroundColor, ownI = cs.backgroundImage;
    var hasC = ownC && ownC !== 'rgba(0, 0, 0, 0)' && ownC !== 'transparent';
    var hasI = ownI && ownI !== 'none';
    if (hasC) rows.push(['fond', ownC, TOKENS[ownC] || null]);
    if (hasI) rows.push(['fond img', ownI.length > 60 ? ownI.slice(0, 60) + '…' : ownI, null]);
    if (!hasC && !hasI) {
      var n = el.parentElement;
      while (n && n.nodeType === 1 && !(n.closest && n.closest('#bdr-root'))) {
        var b = bgOf(n);
        if (b) { rows.push(['fond ↑', b.length > 46 ? b.slice(0, 46) + '…' : b, TOKENS[b] || null]); break; }
        n = n.parentElement;
      }
    }
    var tc = cs.color.trim();
    if (tc && tc !== 'rgba(0, 0, 0, 0)') rows.push(['texte', tc, TOKENS[tc] || null]);
    var ff = (cs.fontFamily || '').trim();
    if (ff && ff !== 'normal') {
      var first = ff.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
      var fm = FONTS[first];
      rows.push(['police', ff.length > 26 ? ff.slice(0, 26) + '…' : ff, fm ? fm.token : null, fm ? fm.label : null]);
    }
    plain('taille', cs.fontSize);
    plain('graisse', cs.fontWeight);
    var box = h('div', { class: 'bdr-props' });
    if (!rows.length) return box;
    box.appendChild(h('div', { class: 'bdr-props-t', text: 'Propriétés' }));
    rows.forEach(function (r) {
      var row = h('div', { class: 'bdr-prop' }, h('span', { class: 'k', text: r[0] }), h('span', { class: 'v', text: r[1] }));
      if (r[2]) row.appendChild(h('span', { class: 'tok', text: r[2] }));
      if (r[3]) row.appendChild(h('span', { class: 'fam', text: r[3] }));
      box.appendChild(row);
    });
    return box;
  }
  function fontSig(cs) { return [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.color, cs.backgroundColor, cs.textTransform, cs.letterSpacing, cs.lineHeight, cs.textDecorationLine].join('|'); }
  function dsClassInert(el) {
    var dsc = dsClassesOf(el);
    if (!dsc.length) return false;
    var before = fontSig(getComputedStyle(el));
    var orig = classAttr(el);
    var keep = orig.split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
    el.setAttribute('class', keep.join(' '));
    var after = fontSig(getComputedStyle(el));
    el.setAttribute('class', orig);
    return before === after;
  }
  /* ══ Un atome peut etre pose et ne rien peindre ═══════════════════════════
   *
   * Mesure du 25.08 sur la home du banc : un `<h3>` porte `s-30-24-cta`, qui
   * rend ~29 px a 1440, et l'ecran sert **54 px**. La regle de `block-title`
   * est plus specifique et gagne. Le panneau affichait donc un nom de cran que
   * la page ne respecte pas, et un changement d'axe ne peignait rien : l'outil
   * disait le contraire de l'ecran, ce qui est exactement ce qu'une revue
   * visuelle ne doit jamais faire.
   *
   * Deux consequences, traitees toutes les deux :
   *   - on le DIT (badge « écrasé » sur la ligne d'axe, avec la valeur servie) ;
   *   - on FORCE le rendu quand on change cet axe, sinon Eliott validerait un
   *     changement qu'il n'a pas vu.
   *
   * ⚠️ On ne force pas par principe : on MESURE d'abord. Forcer partout
   * mettrait des `!important` sur toute la page et masquerait justement les
   * ecrasements qu'on cherche a montrer.
   */

  // les proprietes qu'un atome declare, donc celles sur lesquelles le juger
  function propsOfAtom(name) {
    var a = E.parseAtom(name) || E.parseSizeName(name);
    if (!a) return [];
    if (a.axis === 's' || /^s-/.test(name)) return ['font-size', 'line-height'];
    var out = [];
    (a.decls || []).forEach(function (bloc) {
      if (bloc[0]) return;                       // les blocs imbriques ne se jugent pas ici
      bloc[1].forEach(function (kv) { if (out.indexOf(kv[0]) === -1) out.push(kv[0]); });
    });
    return out;
  }
  function sigOf(el, props) {
    var cs = getComputedStyle(el);
    return props.map(function (p) { return cs.getPropertyValue(p); }).join('|');
  }

  /* Pour une TAILLE, on ne se contente pas de « ca a bougé » : on compare la
   * valeur servie a celle que le moteur annonce pour cette largeur. C'est le
   * seul controle qui attrape un ecrasement quand aucun changement n'a eu lieu. */
  function tailleEcrasee(el, atomName) {
    var a = E.parseAtom(atomName) || E.parseSizeName(atomName);
    if (!a || !(a.axis === 's' || /^s-/.test(atomName))) return null;
    var attendu = E.sizeAt(a.curve, a.max, a.min, innerWidth);
    var servi = parseFloat(getComputedStyle(el).fontSize);
    if (!isFinite(servi) || !isFinite(attendu)) return null;
    return Math.abs(servi - attendu) > 0.6 ? { attendu: attendu, servi: servi } : null;
  }

  // injecte une regle de POIDS FORT pour l'atome : classe doublee + !important
  var forcedRule = {};
  function forceRule(cls) {
    if (forcedRule[cls]) return;
    forcedRule[cls] = true;
    var css = E.synthAtomCSS(cls, true);
    if (!css) return;
    // `.x` -> `.x.x` : (0,2,0), pour battre aussi une regle locale !important
    // moins specifique. Le `!important` seul suffit dans la plupart des cas ;
    // le doublement couvre celui ou la page en pose un aussi.
    ensureSheet().appendChild(document.createTextNode(
      css.replace(/\.([\w-]+)/g, function (m, nom) {
        return nom === cls ? '.' + cls + '.' + cls : m;
      })));
  }

  function bgOf(el) {
    var cs = getComputedStyle(el);
    var c = cs.backgroundColor, img = cs.backgroundImage;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    if (img && img !== 'none') return img;
    return null;
  }

  /* ---- application : on change UN AXE ------------------------------------
   *
   * 🔴 CE QUE FAISAIT LA VERSION PRECEDENTE, ET POURQUOI C'EST DEVENU FAUX.
   * Elle retirait TOUTES les classes DS de l'element avant d'en poser une
   * seule. C'etait juste tant qu'un style etait un nom unique. Depuis que le
   * vocabulaire se compose, changer la taille effacerait la fonte, la couleur
   * et les mods : le meme geste passe de « remplacer un style » a « detruire
   * quatre decisions sur cinq ». On ne touche donc que l'axe vise.
   *
   * UN CRAN MONOLITHIQUE, LUI, OCCUPE TOUS LES AXES A LA FOIS. Toucher un seul
   * axe sur un element qui en porte un obligerait a le laisser en place, et il
   * gagnerait ou perdrait selon la cascade, sans qu'on puisse le dire. On le
   * DEPLIE donc d'abord en ses atomes (traduction du catalogue), puis on
   * applique. Le changement d'axe emporte la migration avec lui, ce qui est
   * exactement ce qu'on veut sur la production.
   */
  var ruleEnsured = {};
  function classesOf(el) { return classAttr(el).trim().split(/\s+/).filter(Boolean); }
  function keptClasses(el) { return classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; }); }
  function axisOf(name) {
    var r = E.resolve(name);
    return r.axis || (r.atom && r.atom.axis) || null;
  }
  function axisIsMultiple(axis) {
    var a = (CAT.axes || []).filter(function (x) { return x.key === axis; })[0];
    return !!(a && a.multiple);
  }
  // deplie les crans / alias / roles en leurs atomes, en gardant l'ordre
  function expandLegacy(list) {
    var out = [];
    list.forEach(function (c) {
      var r = E.resolve(c);
      var src = (r.category === 'legacy' || r.category === 'alias' || r.category === 'role')
        ? (r.atoms || [c]) : [c];
      src.forEach(function (a) { if (out.indexOf(a) === -1) out.push(a); });
    });
    return out;
  }
  // le selecteur .cls a-t-il au moins une regle dans la page ?
  function ruleExists(cls) {
    function scan(rules) {
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.selectorText && r.selectorText.split(',').some(function (s) { return s.trim() === '.' + cls; })) return true;
        if (r.cssRules && scan(r.cssRules)) return true;
      }
      return false;
    }
    for (var s = 0; s < document.styleSheets.length; s++) {
      var rr; try { rr = document.styleSheets[s].cssRules; } catch (e) { continue; }
      if (scan(rr)) return true;
    }
    return false;
  }
  // Si l'atome n'est servi par aucune feuille de la page, on injecte sa regle.
  // C'est le cas de TOUTE la production : elle ne sert aucun `f-`/`s-`/`c-`/`m-`.
  // Sans ca, l'outil dirait qu'il a change quelque chose et l'ecran ne bougerait
  // pas — le contraire de ce qu'une revue visuelle doit garantir.
  function ensureRule(cls) {
    if (ruleEnsured[cls]) return;
    ruleEnsured[cls] = true;
    if (ruleExists(cls)) return;              // deja servi (banc europe-account)
    injectStyle(cls);
  }
  // pose un atome en retirant celui du MEME axe (les mods se cumulent)
  function applyAtomTo(el, atomName) {
    var axis = axisOf(atomName);
    var multi = axisIsMultiple(axis);
    var list = expandLegacy(classesOf(el));
    list.forEach(ensureRule);
    ensureRule(atomName);
    var out = list.filter(function (c) {
      if (c === atomName) return false;
      if (multi) return true;
      return axisOf(c) !== axis;
    });
    out.push(atomName);
    var props = propsOfAtom(atomName);
    var avant = props.length ? sigOf(el, props) : null;
    el.setAttribute('class', out.join(' '));
    // 🔴 VERIFIER L'EFFET, PAS L'INTENTION. Poser la classe ne prouve rien :
    // si la cascade de la page gagne, l'ecran ne bouge pas et Eliott valide un
    // changement qu'il n'a jamais vu.
    if (props.length) {
      var ecrase = tailleEcrasee(el, atomName);
      if (ecrase || sigOf(el, props) === avant) {
        forceRule(atomName);
      }
    }
  }
  function removeAtomFrom(el, atomName) {
    var list = expandLegacy(classesOf(el));
    list.forEach(ensureRule);
    el.setAttribute('class', list.filter(function (c) { return c !== atomName; }).join(' '));
  }
  // migre un element vers ses atomes, sans rien changer d'autre
  function migrateEl(el) {
    var list = expandLegacy(classesOf(el));
    list.forEach(ensureRule);
    el.setAttribute('class', list.join(' '));
  }

  /* ---- registre avant/apres (classe uniquement) -------------------------- */
  function stage(el, apply) {
    if (!beforeOf.has(el)) { beforeOf.set(el, classAttr(el)); touchedEls.push(el); }
    apply(el);
    afterOf.set(el, classAttr(el));
    showAfter = true;
  }
  function applyBA(after) {
    showAfter = after;
    touchedEls.forEach(function (el) {
      el.setAttribute('class', after ? afterOf.get(el) : beforeOf.get(el));
      if (el === selected) { markSelected(el); boxAt(selBox, el); }
    });
    paintMulti();
  }

  /* ---- styles crees (synthese CSS injectee) ------------------------------ */
  function ensureSheet() {
    if (!newStyleSheet) { newStyleSheet = h('style', { id: 'bdr-created' }); document.head.appendChild(newStyleSheet); }
    return newStyleSheet;
  }
  function injectStyle(name) {
    if (injectedCSS[name]) return injectedCSS[name];
    var css = E.synthAtomCSS(name, true);   // !important : l'apercu doit battre les regles locales
    if (!css) return null;
    injectedCSS[name] = css;
    ensureSheet().appendChild(document.createTextNode(css));
    return css;
  }

  /* ---- enregistrement d'un retour ---------------------------------------- */
  function record(el, verdict, extra, pre) {
    var c = pre ? pre.c : classify(el), d = pre ? pre.d : describe(el);
    feedbacks.push(Object.assign({
      verdict: verdict, url: location.pathname, ts: new Date().toISOString(),
      breakpoint: breakpoint(), viewport: innerWidth + 'x' + innerHeight,
      tag: d.tag, id: d.id, open_tag: d.open_tag, text_anchor: d.text_anchor,
      css_path: d.css_path, rect: d.rect, resource: d.resource,
      classes: { ds: c.ds.map(canonOf), dom: d.classes_all }
    }, extra || {}));
    el.setAttribute('data-bdr-v', verdict);
    saveReport(); renderTray(); renderSelected();
  }

  /* ---- peinture ----------------------------------------------------------- */
  function paint() {
    document.querySelectorAll('[class]').forEach(function (el) {
      if (el.closest && el.closest('#bdr-root')) return;
      if (el === selected) return;
      var st = classify(el).state;
      if (styled(st)) el.setAttribute('data-bdr', st);
      else el.removeAttribute('data-bdr');
    });
  }
  function unpaint() { document.querySelectorAll('[data-bdr]').forEach(function (el) { el.removeAttribute('data-bdr'); }); }
  function paintMulti() {
    multiLayer.innerHTML = '';
    if (!multiGroup) return;
    multiGroup.els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var b = h('div', { class: 'bdr-mbox' });
      b.style.left = r.left + 'px'; b.style.top = r.top + 'px'; b.style.width = r.width + 'px'; b.style.height = r.height + 'px';
      multiLayer.appendChild(b);
    });
  }
  // masque le pointille propre de l'element selectionne -> une seule bordure (verte)
  var lastSelMarked = null;
  function markSelected(el) {
    if (lastSelMarked && lastSelMarked !== el) lastSelMarked.removeAttribute('data-bdr-sel');
    if (el) { el.removeAttribute('data-bdr'); el.setAttribute('data-bdr-sel', ''); lastSelMarked = el; }
  }
  function unmarkSelected() {
    if (lastSelMarked) {
      lastSelMarked.removeAttribute('data-bdr-sel');
      var st = classify(lastSelMarked).state;
      if (reviewMode && styled(st)) lastSelMarked.setAttribute('data-bdr', st);
      lastSelMarked = null;
    }
  }

  /* ---- les choix offerts sur chaque axe ----------------------------------
   * Un axe = une liste courte et close (5 fontes, 8 couleurs, 8 mods, 2
   * survols). Seul l'axe des tailles est long, et il se range par RAMPE :
   * melanger les 13 tailles de texte et les 8 de titre dans une meme liste
   * ferait proposer une rampe de banniere sur un paragraphe. */
  var AXIS_LABEL = {};
  (CAT.axes || []).forEach(function (a) { AXIS_LABEL[a.key] = a.label; });
  var CURVE_LABEL = { text: 'Texte', cta: 'Titres (rampe CTA)', title: 'Titres (rampe titre)',
                      banner: 'Bannière', fixed: 'Taille fixe' };
  function optionsForAxis(axis, curveHint) {
    var list = (E.atomsOf[axis] || []).slice();
    if (axis !== 's') {
      return [{ title: AXIS_LABEL[axis], items: list }];
    }
    var byCurve = {};
    list.forEach(function (a) { (byCurve[a.curve] = byCurve[a.curve] || []).push(a); });
    var order = Object.keys(byCurve).sort(function (a, b) {
      if (a === curveHint) return -1;          // la rampe de l'element d'abord
      if (b === curveHint) return 1;
      return a.localeCompare(b);
    });
    return order.map(function (c) {
      return { title: CURVE_LABEL[c] || c,
               items: byCurve[c].sort(function (x, y) { return y.max - x.max; }) };
    });
  }
  // etiquette d'un atome dans une liste : son nom, et ce qu'il rend
  function atomLabel(a) {
    if (a.axis === 's' || /^s-/.test(a.name)) {
      if (a.curve === 'fixed') return a.name + '  ·  ' + a.max + ' px fixes';
      return a.name + '  ·  ' + a.max + ' px → ' + a.min + ' px';
    }
    return a.name + (a.label ? '  ·  ' + a.label : '');
  }
  // la rampe de la taille actuellement portee (pour trier les propositions)
  function curveOf(el) {
    var r = readEl(el);
    var sz = r.s && E.parseAtom(r.s);
    if (sz) return sz.curve;
    for (var i = 0; i < r.legacy.length; i++) {
      var at = E.legacyToAtoms(r.legacy[i]) || [];
      for (var j = 0; j < at.length; j++) {
        var a = E.parseAtom(at[j]);
        if (a && a.axis === 's') return a.curve;
      }
    }
    return 'text';
  }

  /* ======================================================================= *
   *  UI ROOT + STYLES
   * ======================================================================= */
  var root = h('div', { id: 'bdr-root' });
  var style = h('style', {
    text: `
      #bdr-root{position:fixed;inset:0;z-index:${Z};pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
      #bdr-root *{box-sizing:border-box;}
      [data-bdr="ds"]{outline:1px dashed rgba(120,140,170,.35) !important;outline-offset:1px !important;}
      [data-bdr="legacy"]{outline:1px dashed rgba(251,191,36,.55) !important;outline-offset:1px !important;}
      [data-bdr-sel]{outline:none !important;}
      [data-bdr-live] [data-bdr-v]{outline:2px solid rgba(45,212,191,.55) !important;outline-offset:2px !important;}
      #bdr-hovbox,#bdr-selbox{position:fixed;pointer-events:none;display:none;border-radius:4px;}
      #bdr-hovbox{border:2px dashed #fbbf24;background:rgba(251,191,36,.06);}
      #bdr-selbox{border:2px solid #22c55e;background:rgba(34,197,94,.07);box-shadow:0 0 0 1px rgba(34,197,94,.3),0 0 16px rgba(34,197,94,.28);}
      #bdr-multilayer{position:fixed;inset:0;pointer-events:none;}
      .bdr-mbox{position:fixed;border:2px solid #a855f7;background:rgba(168,85,247,.10);border-radius:4px;}
      .bdr-multibanner{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#a855f722;border:1px solid #a855f766;color:#e9d5ff;border-radius:9px;padding:8px 10px;margin-bottom:11px;font-size:11.5px;font-weight:600;}
      .bdr-multix{cursor:pointer;color:#d8b4fe;font-size:16px;line-height:1;padding:0 4px;} .bdr-multix:hover{color:#fca5a5;}
      .bdr-axes{margin:9px 0 4px;}
      .bdr-axrow{display:flex;align-items:center;gap:8px;padding:5px 7px;border:1px solid #22303f;border-radius:7px;margin-bottom:4px;cursor:pointer;background:#131c27;}
      .bdr-axrow:hover{background:#1b2634;border-color:#31465e;}
      .bdr-axrow.miss{border-color:#7c5b1a;background:#1d1a12;}
      .bdr-axk{flex:0 0 62px;color:#8fa3b8;font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;}
      .bdr-axv{flex:1;min-width:0;display:flex;flex-wrap:wrap;gap:4px;}
      .bdr-axtag{display:inline-flex;align-items:center;gap:4px;background:#16a34a22;color:#4ade80;border-radius:5px;padding:2px 6px;font-size:11px;font-weight:600;}
      .bdr-axtag.beat{background:#7c1d1d33;color:#fca5a5;}
      .bdr-axbeat{font-weight:500;opacity:.85;}
      .bdr-axoff{cursor:pointer;color:#94a3b8;font-size:12px;line-height:1;} .bdr-axoff:hover{color:#fca5a5;}
      .bdr-axnone{color:#64748b;font-size:11px;font-style:italic;}
      .bdr-axrow.miss .bdr-axnone{color:#d9a441;font-style:normal;}
      .bdr-axgo{flex:0 0 auto;color:#64748b;font-size:12px;}
      .bdr-opt.on{background:#16a34a22;color:#4ade80;}
      .bdr-opt.off{color:#fca5a5;}
      .bdr-scss{margin:7px 0;padding:7px 9px;border:1px solid #22303f;border-radius:7px;background:#0d141d;color:#93c5fd;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;white-space:pre-wrap;word-break:break-all;}
      .bdr-v.migrate{background:#7c5b1a33;border-color:#a97c2166;color:#fbbf24;}
      #bdr-onebox{position:fixed;pointer-events:none;display:none;border:2px solid #a855f7;background:rgba(168,85,247,.12);border-radius:4px;box-shadow:0 0 0 2px rgba(168,85,247,.3);}
      .bdr-msel{max-height:300px;overflow-y:auto;margin-top:8px;border-top:1px solid #22303f;}
      .bdr-msel-row{display:flex;align-items:center;gap:7px;padding:5px 3px;border-bottom:1px solid #161f2b;font-size:11px;}
      .bdr-msel-row:hover{background:#1b2634;}
      .bdr-msel-row.hidden{opacity:.55;}
      .bdr-msel-row .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex:0 0 auto;}
      .bdr-msel-row .dot.off{background:#5b6b7d;}
      .bdr-msel-row .txt{flex:1;min-width:0;color:#e6eaf0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .bdr-msel-row .prov{color:#8896a8;font-family:ui-monospace,monospace;font-size:10px;white-space:nowrap;max-width:42%;overflow:hidden;text-overflow:ellipsis;}
      .bdr-msel-row .rm{cursor:pointer;color:#6b7b8d;font-size:15px;line-height:1;padding:0 3px;flex:0 0 auto;} .bdr-msel-row .rm:hover{color:#fca5a5;}
      /* width plafonnee pour toujours laisser une bande de page atteignable a
         cote du panneau (sinon, sur petit ecran, un panneau de 360px recouvre
         un menu responsive pleine largeur des deux cotes). Desktop inchange. */
      #bdr-panel{position:fixed;top:0;right:0;bottom:0;width:min(360px, calc(100vw - 120px));z-index:${Z};pointer-events:auto;display:flex;flex-direction:column;background:#0f1620;color:#e6eaf0;font-size:12.5px;line-height:1.45;border-left:1px solid #22303f;box-shadow:-14px 0 44px rgba(0,0,0,.45);transition:transform .22s cubic-bezier(.4,0,.2,1);}
      #bdr-panel.collapsed{transform:translateX(100%);}
      #bdr-reopen{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:${Z};pointer-events:auto;display:none;background:linear-gradient(135deg,#fb923c,#f97316);color:#fff;padding:15px 8px;border-radius:11px 0 0 11px;cursor:pointer;font-weight:700;font-size:11px;letter-spacing:.02em;writing-mode:vertical-rl;box-shadow:-4px 0 18px rgba(0,0,0,.35);}
      #bdr-reopen:hover{filter:brightness(1.07);}
      /* Dock a gauche : le tiroir des menus responsive est ancre a DROITE, du
         meme cote que le panneau -> il le recouvrait. Docke a gauche, le panneau
         libere le menu (clic sur ses items possible). */
      #bdr-panel.dock-left{right:auto;left:0;border-left:none;border-right:1px solid #22303f;box-shadow:14px 0 44px rgba(0,0,0,.45);}
      #bdr-panel.dock-left.collapsed{transform:translateX(-100%);}
      #bdr-reopen.dock-left{right:auto;left:0;border-radius:0 11px 11px 0;box-shadow:4px 0 18px rgba(0,0,0,.35);}
      .bdr-hd{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #1b2634;background:#0b1119;}
      .bdr-brand{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:700;white-space:nowrap;}
      .bdr-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;flex:0 0 auto;}
      .bdr-icon{cursor:pointer;background:none;border:none;color:#8896a8;font-size:15px;line-height:1;padding:5px 9px;border-radius:7px;}
      .bdr-icon:hover{background:#1b2634;color:#e6eaf0;}
      #bdr-top{padding:15px 16px;border-bottom:1px solid #1b2634;}
      .bdr-cta{display:block;width:100%;cursor:pointer;border:none;border-radius:11px;padding:13px;font-size:13px;font-weight:700;color:#fff;background:linear-gradient(135deg,#34d399,#22c55e);box-shadow:0 6px 18px rgba(34,197,94,.32);transition:transform .12s,box-shadow .12s;}
      .bdr-cta:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(34,197,94,.42);}
      .bdr-steps{display:flex;gap:6px;margin-top:13px;}
      .bdr-stp{flex:1;text-align:center;font-size:10.5px;color:#5b6b7d;border-top:2px solid #22303f;padding-top:7px;}
      .bdr-stp.on{color:#86efac;border-color:#22c55e;}
      .bdr-hint{color:#8896a8;font-size:11.5px;margin-top:11px;line-height:1.55;}
      .bdr-kbd{font-family:ui-monospace,monospace;background:#1b2634;border:1px solid #2a3a4c;border-radius:4px;padding:0 5px;color:#c3ccd8;}
      .bdr-live-row{display:flex;align-items:center;gap:9px;}
      .bdr-livedot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:bdrpulse 1.6s infinite;flex:0 0 auto;}
      @keyframes bdrpulse{0%,100%{opacity:1;}50%{opacity:.3;}}
      .bdr-live-lbl{font-weight:600;flex:1;}
      .bdr-ghost{cursor:pointer;background:none;border:1px solid #2a3a4c;color:#c3ccd8;border-radius:8px;padding:5px 12px;font-size:11.5px;font-weight:600;}
      .bdr-ghost:hover{background:#1b2634;border-color:#3a4c60;}
      .bdr-meta{display:flex;gap:6px;margin-top:12px;align-items:center;flex-wrap:wrap;}
      .bdr-chip2{background:#16202c;border:1px solid #22303f;border-radius:7px;padding:4px 9px;font-size:11px;color:#8896a8;font-variant-numeric:tabular-nums;}
      .bdr-hover{color:#8896a8;font-size:11px;margin-top:12px;min-height:15px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-card{margin:12px 14px 0;background:#131c27;border:1px solid #22303f;border-radius:12px;padding:13px;}
      #bdr-panel.acting .bdr-card .bdr-props,#bdr-panel.acting .bdr-card .bdr-stack{display:none;}
      .bdr-empty{margin:30px 18px;text-align:center;color:#5b6b7d;font-size:12px;line-height:1.6;}
      .bdr-empty b{display:block;color:#8896a8;font-size:13px;margin-bottom:5px;font-weight:600;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .bdr-state{font-weight:700;padding:3px 9px;border-radius:7px;font-size:11px;}
      .bdr-state.ds{background:#22c55e22;color:#86efac;}
      .bdr-state.override{background:#ef444422;color:#fca5a5;} .bdr-state.plain{background:#8896a822;color:#c3ccd8;}
      .bdr-nav{display:flex;gap:3px;align-items:center;}
      .bdr-navbtn{cursor:pointer;color:#8896a8;font-size:15px;line-height:1;font-weight:700;padding:2px 7px;border-radius:6px;}
      .bdr-navbtn:hover{background:#1b2634;color:#e6eaf0;}
      .bdr-x{cursor:pointer;color:#8896a8;font-size:17px;line-height:1;padding:0 5px;} .bdr-x:hover{color:#fca5a5;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px;}
      .bdr-chip{display:inline-block;padding:2px 7px;border-radius:6px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#6b7b8d;font-size:11px;word-break:break-word;font-family:ui-monospace,monospace;}
      .bdr-res{display:flex;gap:6px;align-items:baseline;margin-top:7px;font-size:11px;color:#8896a8;}
      .bdr-res .p{color:#5eead4;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-props{margin-top:11px;border-top:1px solid #22303f;padding-top:9px;}
      .bdr-props-t,.bdr-stack-t{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
      .bdr-prop{display:flex;gap:8px;align-items:baseline;font-size:11px;padding:2px 0;flex-wrap:wrap;}
      .bdr-prop .k{color:#6b7b8d;min-width:48px;} .bdr-prop .v{color:#e6eaf0;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-prop .tok{color:#2dd4bf;font-family:ui-monospace,monospace;background:#2dd4bf1f;padding:1px 6px;border-radius:5px;}
      .bdr-prop .fam{color:#c4b5fd;font-family:ui-monospace,monospace;background:#a855f71f;padding:1px 6px;border-radius:5px;}
      .bdr-warn{margin-top:10px;font-size:11px;color:#fcd34d;background:#78350f4d;border:1px solid #9a3412;border-radius:8px;padding:8px 10px;line-height:1.45;}
      .bdr-stack{margin-top:11px;border-top:1px solid #22303f;padding-top:8px;}
      .bdr-stack-scroll{max-height:196px;overflow-y:auto;margin:0 -4px;padding:0 4px;}
      .bdr-stack-row{cursor:pointer;padding:3px 7px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#8896a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .bdr-stack-row:hover{background:#1b2634;color:#e6eaf0;} .bdr-stack-row.on{background:#22c55e26;color:#86efac;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:7px;padding:12px 14px 4px;}
      .bdr-v{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#e6eaf0;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:600;transition:background .12s;}
      .bdr-v:hover{background:#22303f;}
      .bdr-v.create{border-color:#3b82f6;color:#93c5fd;background:#3b82f614;}
      .bdr-v.multi{border-color:#a855f7;color:#d8b4fe;background:#a855f714;width:100%;text-align:left;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;margin:8px 0;font-size:12px;background:#0b1119;color:#e6eaf0;}
      #bdr-search:focus{outline:none;border-color:#22c55e;}
      .bdr-opt{cursor:pointer;padding:6px 9px;border-radius:7px;font-family:ui-monospace,monospace;font-size:11px;color:#c3ccd8;}
      .bdr-opt:hover{background:#22c55e;color:#062012;}
      .bdr-optgroup{color:#6b7b8d;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 4px;border-top:1px solid #22303f;margin-top:3px;}
      .bdr-bld{padding:6px 0 12px;}
      .bdr-bld-t{color:#93c5fd;font-weight:700;font-size:12px;margin:8px 0 4px;}
      .bdr-lbl{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:11px 0 5px;}
      .bdr-fams{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-fam{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:8px;padding:6px 10px;font-size:11.5px;}
      .bdr-fam.on{border-color:#3b82f6;background:#3b82f622;color:#dbeafe;}
      .bdr-sizerow{display:flex;align-items:center;gap:8px;}
      .bdr-num{width:66px;padding:7px 8px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:13px;font-family:ui-monospace,monospace;}
      .bdr-num:focus{outline:none;border-color:#22c55e;}
      .bdr-sizechips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
      .bdr-sc{cursor:pointer;font-family:ui-monospace,monospace;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid #2a3a4c;color:#8896a8;}
      .bdr-sc.exists{border-color:#22c55e66;color:#86efac;background:#22c55e14;}
      .bdr-sc:hover{border-color:#22c55e;color:#86efac;}
      .bdr-mods{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-mod{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:20px;padding:5px 12px;font-size:11.5px;}
      .bdr-mod.on{border-color:#a855f7;background:#a855f722;color:#e9d5ff;}
      .bdr-mod.exists:not(.on){border-color:#22c55e66;color:#86efac;background:#22c55e12;}
      .bdr-preview{margin:12px 0;padding:11px 12px;border:1px dashed #2a3a4c;border-radius:10px;background:#0b1119;}
      .bdr-name{font-family:ui-monospace,monospace;font-size:13px;color:#86efac;word-break:break-all;}
      .bdr-status{margin-top:7px;font-size:11px;line-height:1.5;}
      .bdr-status.exists{color:#86efac;} .bdr-status.new{color:#93c5fd;}
      .bdr-role{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:12px;margin:8px 0 12px;font-family:inherit;}
      .bdr-role:focus{outline:none;border-color:#3b82f6;}
      #bdr-note{width:100%;height:84px;border:1px solid #2a3a4c;border-radius:8px;padding:8px;font-size:12px;resize:vertical;background:#0b1119;color:#e6eaf0;margin:8px 0;font-family:inherit;}
      #bdr-note:focus{outline:none;border-color:#22c55e;}
      .bdr-btn{cursor:pointer;border:none;border-radius:9px;padding:9px;font-size:12px;font-weight:600;background:#22303f;color:#e6eaf0;width:100%;}
      .bdr-rep{padding:6px 0 14px;}
      .bdr-rep-ba{display:flex;gap:8px;align-items:center;margin:8px 0 12px;}
      .bdr-ba{flex:1;cursor:pointer;text-align:center;border:1px solid #2a3a4c;border-radius:9px;padding:8px;font-size:12px;font-weight:600;color:#c3ccd8;background:#182230;}
      .bdr-ba.on{border-color:#22c55e;background:#22c55e22;color:#86efac;}
      .bdr-rep-pg{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:10px 2px 3px;border-top:1px solid #1b2634;margin-top:4px;}
      .bdr-rep-row{display:flex;gap:8px;align-items:flex-start;padding:7px 0;font-size:11.5px;}
      .bdr-rep-v{flex:0 0 auto;font-size:14px;}
      .bdr-rep-main{flex:1;min-width:0;}
      .bdr-rep-main .to{color:#86efac;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-rep-main .anc{color:#6b7b8d;font-size:10.5px;word-break:break-word;}
      .bdr-rep-del{cursor:pointer;color:#6b7b8d;font-size:14px;} .bdr-rep-del:hover{color:#fca5a5;}
      .bdr-lock{width:100%;margin-top:14px;cursor:pointer;border:1px solid #22c55e55;background:#14532d33;color:#86efac;border-radius:9px;padding:10px;font-size:12px;font-weight:700;}
      .bdr-clear{width:100%;margin-top:8px;cursor:pointer;border:1px solid #3a2530;background:none;color:#8896a8;border-radius:9px;padding:7px;font-size:11px;}
      .bdr-clear:hover{color:#fca5a5;border-color:#7f1d1d;}
      .bdr-ft{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;border-top:1px solid #1b2634;background:#0b1119;}
      .bdr-tab{cursor:pointer;font-size:11.5px;font-weight:600;color:#8896a8;padding:6px 10px;border-radius:8px;}
      .bdr-tab:hover{color:#e6eaf0;} .bdr-tab.on{color:#86efac;background:#22c55e18;}
      .bdr-exp{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-size:12px;font-weight:700;color:#062012;background:linear-gradient(135deg,#34d399,#22c55e);box-shadow:0 4px 12px rgba(34,197,94,.3);}
      .bdr-exp:hover{filter:brightness(1.06);}
      #bdr-toast{position:fixed;bottom:18px;right:376px;z-index:${Z};pointer-events:none;background:#0d9488;color:#fff;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:600;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;box-shadow:0 8px 24px rgba(0,0,0,.4);}
      #bdr-toast.on{opacity:1;transform:translateY(0);}
    `
  });

  /* ---- toast -------------------------------------------------------------- */
  var toastEl = h('div', { id: 'bdr-toast' });
  var toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1700); }

  /* ---- structure du panneau ---------------------------------------------- */
  var resBadge = h('span', { class: 'bdr-chip2' });
  var countBadge = h('span', { class: 'bdr-tab', text: 'Modifications enregistrées · 0', onclick: showReport });
  var exportBtn = h('button', { class: 'bdr-exp', text: 'Exporter', onclick: exportJSON });
  var hoverLine = h('div', { class: 'bdr-hover' });
  var selCard = h('div', {});
  var verbsBox = h('div', { class: 'bdr-verbs' });
  var dynBox = h('div', { class: 'bdr-dyn' });
  var topZone = h('div', { id: 'bdr-top' });

  var dockBtn = h('button', { class: 'bdr-icon', title: 'Changer de côté (gauche/droite) — utile pour le menu responsive', text: '⇋', onclick: function () { setDock(!dockLeft); } });
  var panel = h('div', { id: 'bdr-panel', class: 'collapsed' },
    h('div', { class: 'bdr-hd' },
      h('div', { class: 'bdr-brand' }, h('span', { class: 'bdr-dot' }), 'Design Review'),
      h('div', { style: 'display:flex;gap:2px' }, dockBtn,
        h('button', { class: 'bdr-icon', title: 'Cacher (rouvre via l’onglet)', text: '⟩', onclick: collapse }))),
    topZone, selCard, verbsBox, dynBox,
    h('div', { class: 'bdr-ft' }, countBadge, exportBtn)
  );
  var reopen = h('div', { id: 'bdr-reopen', title: 'Ouvrir Design Review', text: '◀ Design Review', onclick: expand });

  // Cote d'ancrage du panneau. TOUJOURS a GAUCHE : les tiroirs du site (menu
  // responsive, avis) sont ancres a DROITE, un panneau a gauche ne les recouvre
  // jamais. Pas de preference persistee (la gauche resout les conflits d'emblee).
  // Le bouton ⇋ permet un deplacement ponctuel a droite dans la session.
  var dockLeft = true;
  function setDock(left) {
    dockLeft = left;
    panel.classList.toggle('dock-left', left);
    reopen.classList.toggle('dock-left', left);
    reopen.textContent = left ? 'Design Review ▶' : '◀ Design Review';
  }

  function syncState() {
    topZone.innerHTML = '';
    if (!reviewMode) {
      if (pageLocked) {
        topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Reprendre la revue', onclick: function () { pageLocked = false; toggle(); } }));
        topZone.appendChild(h('div', { class: 'bdr-hint', html: 'Page <b>verrouillée</b> — pause de revue. Les liens sont réactivés : <b>navigue vers une autre page</b>, puis relance la revue là-bas.' }));
      } else {
        topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Démarrer la revue', onclick: toggle }));
        topZone.appendChild(h('div', { class: 'bdr-steps' },
          h('div', { class: 'bdr-stp on', text: '1 · Visiter' }),
          h('div', { class: 'bdr-stp', text: '2 · Reviewer' }),
          h('div', { class: 'bdr-stp', text: '3 · Rapport' })));
        topZone.appendChild(h('div', { class: 'bdr-hint', html: 'Clique un élément → change <b>un axe</b> de sa composition, ou annote. Raccourcis : <span class="bdr-kbd">F</span> fonte · <span class="bdr-kbd">T</span> taille · <span class="bdr-kbd">C</span> couleur · <span class="bdr-kbd">M</span> mod · <span class="bdr-kbd">H</span> survol · <span class="bdr-kbd">X</span> nouvelle taille · <span class="bdr-kbd">N</span> note · <span class="bdr-kbd">G</span> cibler · <span class="bdr-kbd">↑↓</span> hiérarchie.' }));
      }
    } else {
      topZone.appendChild(h('div', { class: 'bdr-live-row' },
        h('span', { class: 'bdr-livedot' }),
        h('span', { class: 'bdr-live-lbl', text: 'Revue en cours' }),
        h('button', { class: 'bdr-ghost', title: 'Suspendre (Alt+R)', text: '⏸ Pause', onclick: toggle })));
      topZone.appendChild(h('div', { class: 'bdr-meta' }, resBadge));
      topZone.appendChild(hoverLine);
    }
  }

  /* ---- selection --------------------------------------------------------- */
  function setSel(el) { clearDyn(); selected = el; markSelected(el); boxAt(selBox, el); if (view === 'report') view = 'review'; renderSelected(); }
  function select(el) { stackScroll = 0; selPath = el; clearMulti(); setSel(el); expand(); }
  function deselect() { clearDyn(); unmarkSelected(); selected = null; selPath = null; selBox.style.display = 'none'; clearMulti(); renderSelected(); }
  function navUp() {
    if (!selected) return;
    var p = selected.parentElement;
    if (p && p.nodeType === 1 && p !== document.body && p !== document.documentElement && !(p.closest && p.closest('#bdr-root'))) { clearMulti(); setSel(p); }
  }
  function navDown() {
    if (!selected || !selPath || selected === selPath) return;
    var n = selPath;
    while (n && n.parentElement !== selected) n = n.parentElement;
    if (n) { clearMulti(); setSel(n); }
  }

  /* ---- multi-selection par classe ---------------------------------------- */
  function clearMulti() { multiGroup = null; paintMulti(); }
  function selectGroup(cls) {
    var els = Array.prototype.slice.call(document.querySelectorAll('.' + CSS.escape(cls)))
      .filter(function (el) { return !(el.closest && el.closest('#bdr-root')); });
    multiGroup = { selector: cls, els: els };
    paintMulti(); renderSelected();
    toast('🎯 ' + els.length + ' éléments ciblés');
  }
  // cibler le groupe au clavier (G) : marche AVANT que le menu hover ne se ferme
  function cibleGroupe() {
    if (!selected) return;
    var nm = classAttr(selected).trim().split(/\s+/).filter(Boolean).find(function (x) {
      var r = E.resolve(x);
      return r.category !== 'unknown' && r.category !== 'buildable' && document.querySelectorAll('.' + CSS.escape(x)).length > 1;
    });
    if (nm) { (multiGroup && multiGroup.selector === nm) ? clearMulti() : selectGroup(nm); renderSelected(); }
    else toast('Pas de classe partagée sur cet élément');
  }

  /* ---- vue multi : liste inspectable + editable -------------------------- */
  var oneBox = h('div', { id: 'bdr-onebox' });
  function highlightOne(el) { boxAt(oneBox, el); }
  function clearOne() { oneBox.style.display = 'none'; }
  // repere de provenance : le plus proche ancetre "discernable" (id, ou classe landmark)
  function provenance(el) {
    var n = el.parentElement;
    while (n && n.nodeType === 1 && n !== document.body && !(n.closest && n.closest('#bdr-root'))) {
      if (n.id) return n.tagName.toLowerCase() + '#' + n.id;
      var strong = (n.getAttribute('class') || '').split(/\s+/).find(function (c) {
        return c && E.resolve(c).category === 'unknown' && /menu|nav|header|footer|section|panel|card|hero|slide|form|dropdown|submenu|sub-menu|content|block|column|aside|widget|banner/.test(c);
      });
      if (strong) return n.tagName.toLowerCase() + '.' + strong;
      n = n.parentElement;
    }
    return (el.parentElement || el).tagName.toLowerCase();
  }
  function removeFromGroup(el) {
    var i = multiGroup.els.indexOf(el);
    if (i >= 0) multiGroup.els.splice(i, 1);
    clearOne();
    if (!multiGroup.els.length) { clearMulti(); renderSelected(); return; }
    paintMulti(); renderSelected();
  }
  function renderMultiList() {
    selCard.className = 'bdr-card';
    var vis = multiGroup.els.filter(function (el) { return el.offsetParent; }).length;
    selCard.appendChild(h('div', { class: 'bdr-multibanner' },
      h('span', { text: '🎯 ' + multiGroup.els.length + ' ciblés · ' + vis + ' visibles' }),
      h('span', { class: 'bdr-multix', text: '×', title: 'Tout annuler', onclick: function () { clearMulti(); renderSelected(); } })));
    selCard.appendChild(h('div', { class: 'bdr-hint', text: 'Survole pour localiser sur la page · × pour retirer de la sélection' }));
    var list = h('div', { class: 'bdr-msel' });
    multiGroup.els.forEach(function (el) {
      var visible = !!el.offsetParent;
      var txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) || ('<' + el.tagName.toLowerCase() + '>');
      var row = h('div', { class: 'bdr-msel-row' + (visible ? '' : ' hidden'),
        onmouseenter: function () { if (visible) { try { el.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) {} highlightOne(el); } },
        onmouseleave: clearOne },
        h('span', { class: 'dot' + (visible ? '' : ' off'), title: visible ? 'visible' : 'caché' }),
        h('span', { class: 'txt', text: txt }),
        h('span', { class: 'prov', text: provenance(el) }),
        h('span', { class: 'rm', text: '×', title: 'Retirer de la sélection', onclick: function (e) { e.stopPropagation(); removeFromGroup(el); } }));
      list.appendChild(row);
    });
    selCard.appendChild(list);
    // en mode groupe, l'axe se choisit d'abord : le changement porte sur les N
    (CAT.axes || []).forEach(function (a) {
      verbsBox.appendChild(h('button', { class: 'bdr-v', text: '🔁 ' + a.label + ' (groupe)',
        onclick: function () { showAxisPicker(a.key); } }));
    });
    verbsBox.appendChild(h('button', { class: 'bdr-v migrate', text: '♻️ Migrer le groupe',
      onclick: function () { commitMigrate(); } }));
    verbsBox.appendChild(h('button', { class: 'bdr-v create', text: '➕ Nouvelle taille (groupe)', onclick: showBuilder }));
  }

  /* ---- carte de l'element selectionne ------------------------------------ */
  function renderSelected() {
    panel.classList.remove('acting');
    verbsBox.innerHTML = ''; selCard.innerHTML = '';
    if (view === 'report') { renderReport(); return; }
    dynBox.innerHTML = '';
    if (multiGroup) { renderMultiList(); return; }
    if (!selected) {
      selCard.className = '';
      if (reviewMode) selCard.appendChild(h('div', { class: 'bdr-empty' }, h('b', { text: 'Aucun élément sélectionné' }), 'Survole la page puis clique un élément pour l’inspecter.'));
      return;
    }
    selCard.className = 'bdr-card';
    var c = classify(selected), d = describe(selected);
    var stLabel = { ds: '✅ Composition DS', legacy: '⚠️ Ancien nom — à migrer',
                    plain: '— sans style DS —' }[c.state];
    selCard.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ' + c.state, text: stLabel }),
      h('span', { class: 'bdr-nav' },
        h('span', { class: 'bdr-x', text: '×', title: 'Désélectionner (Échap)', onclick: deselect }))));

    // une ligne par AXE : c'est la lecture que la composition impose. Un
    // element ne porte plus un style qu'on remplace, il porte cinq decisions
    // qu'on change une par une.
    selCard.appendChild(axisRows(selected, c));
    selCard.appendChild(h('div', { class: 'bdr-anchor', text: '<' + d.tag + '>  ' + d.text_anchor }));
    if (d.resource) selCard.appendChild(h('div', { class: 'bdr-res' }, h('span', { text: '🖼' }), h('span', { class: 'p', text: d.resource })));
    selCard.appendChild(propsBlock(selected));

    // hierarchie sous le curseur (scrollbox complete jusqu'a <html>)
    if (lastStack.length > 1) {
      var scroll = h('div', { class: 'bdr-stack-scroll', onscroll: function () { stackScroll = scroll.scrollTop; } });
      lastStack.forEach(function (el) {
        var cls = classAttr(el).trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
        var label = '<' + el.tagName.toLowerCase() + '>' + (cls ? ' .' + cls : '');
        scroll.appendChild(h('div', { class: 'bdr-stack-row' + (el === selected ? ' on' : ''), text: label, title: label, onclick: function () { clearMulti(); setSel(el); } }));
      });
      selCard.appendChild(h('div', { class: 'bdr-stack' }, h('div', { class: 'bdr-stack-t', text: 'Hiérarchie (clique pour remonter)' }), scroll));
      scroll.scrollTop = stackScroll;
    }

    // multi-selection : un bouton par classe DS partagee (>1 element)
    var shared = [];
    classAttr(selected).trim().split(/\s+/).forEach(function (nm) {
      if (!nm) return;
      var r = E.resolve(nm);
      if (r.category === 'unknown' || r.category === 'buildable') return;
      var n = document.querySelectorAll('.' + CSS.escape(nm)).length;
      if (n > 1) shared.push({ nm: nm, n: n, canon: canonOf(r) });
    });
    shared.forEach(function (s) {
      var on = multiGroup && multiGroup.selector === s.nm;
      var label = shared.length > 1 ? ('🎯 Cibler les ' + s.n + ' × ' + s.canon) : ('🎯 Cibler les ' + s.n + ' éléments de ce style');
      verbsBox.appendChild(h('button', { class: 'bdr-v multi' + (on ? ' on' : ''), title: 'Sélectionner les ' + s.n + ' éléments identiques pour un changement groupé', text: label, onclick: function () { on ? clearMulti() : selectGroup(s.nm); renderSelected(); } }));
    });

    if (c.state === 'legacy') {
      var cible = E.atomsFor(classesOf(selected)).join(' ');
      verbsBox.appendChild(h('button', {
        class: 'bdr-v migrate', text: '♻️ Migrer vers les atomes',
        title: cible ? 'Deviendra : ' + cible : '',
        onclick: function () { commitMigrate(); }
      }));
    }
    verbsBox.appendChild(h('button', { class: 'bdr-v create', text: '➕ Nouvelle taille', onclick: showBuilder }));
    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '📝 Ajouter une note', onclick: showNote }));
  }

  /* ---- cibles + preview -------------------------------------------------- */
  function targets() { return multiGroup ? multiGroup.els : (selected ? [selected] : []); }
  function clearDyn() { restorePreview(); if (dynCleanup) { try { dynCleanup(); } catch (e) {} dynCleanup = null; } }

  var previewSaved = null;   // Map<el, snap>
  function applyToTargets(fn) {
    targets().forEach(fn);
    if (selected) { markSelected(selected); boxAt(selBox, selected); } paintMulti();
  }
  function startPreview() {
    if (!previewSaved) { previewSaved = new Map(); targets().forEach(function (el) { previewSaved.set(el, classAttr(el)); }); }
  }
  function previewAtom(atomName) {
    startPreview();
    applyToTargets(function (el) { applyAtomTo(el, atomName); });
  }
  function previewWithout(atomName) {
    startPreview();
    applyToTargets(function (el) { removeAtomFrom(el, atomName); });
  }
  function restorePreview() {
    if (previewSaved) { previewSaved.forEach(function (v, el) { el.setAttribute('class', v); }); previewSaved = null; if (selected) { markSelected(selected); boxAt(selBox, selected); } paintMulti(); }
  }

  /* Enregistre un changement. `apply` dit ce qu'on fait a CHAQUE cible ; le
   * rapport porte l'etat avant, l'etat apres, et l'axe touche — Claude Code a
   * besoin des trois pour reecrire le markup sans deviner. */
  function commit(verdict, apply, extra) {
    restorePreview();
    var els = targets();
    if (!els.length) return;
    var ref = els[0], pre = { d: describe(ref), c: classify(ref) };
    var avant = classesOf(ref).slice();
    els.forEach(function (el) { stage(el, apply); });
    var apres = classesOf(ref).slice();
    var info = Object.assign({
      from: avant, to: apres,
      atoms_before: E.atomsFor(avant), atoms_after: E.atomsFor(apres)
    }, extra || {});
    if (multiGroup) info.group = { selector: '.' + multiGroup.selector, count: els.length };
    record(ref, verdict, info, pre);
    fbEls.set(feedbacks[feedbacks.length - 1], els.slice());
    return info;
  }
  function commitAtom(atomName, extra) {
    var axis = axisOf(atomName);
    commit((extra && extra.new_size) ? 'create' : 'swap',
           function (el) { applyAtomTo(el, atomName); },
           Object.assign({ axis: axis, proposition: atomName }, extra || {}));
    toast((multiGroup ? targets().length + ' éléments · ' : '') + atomName + ' — enregistré');
    clearMulti();
  }
  function commitRemoveAtom(atomName) {
    commit('swap', function (el) { removeAtomFrom(el, atomName); },
           { axis: axisOf(atomName), retire: atomName });
    toast(atomName + ' retiré — enregistré');
    clearMulti();
  }
  function commitMigrate() {
    var info = commit('migrate', migrateEl, { axis: null });
    toast('Migré vers ' + ((info && info.atoms_after) || []).join(' '));
    clearMulti();
  }

  /* ---- la composition, un axe par ligne ----------------------------------
   * Ce que cette table rend visible et que la liste de chips cachait : ce que
   * l'element NE porte PAS. Une fonte sans taille retombe sur ce que son
   * parent lui donne, et le lire d'un coup d'oeil est la moitie de la revue. */
  function axisRows(el, c) {
    var box = h('div', { class: 'bdr-axes' });
    var read = readEl(el);
    var manquants = E.missingAxes(read);

    (CAT.axes || []).forEach(function (a) {
      var val = a.multiple ? read[a.key] : (read[a.key] ? [read[a.key]] : []);
      var row = h('div', { class: 'bdr-axrow' + (manquants.indexOf(a.key) !== -1 ? ' miss' : '') });
      row.appendChild(h('span', { class: 'bdr-axk', text: a.label }));
      var vals = h('span', { class: 'bdr-axv' });
      if (val.length) {
        val.forEach(function (nm) {
          var at = E.parseAtom(nm);
          var ecrase = tailleEcrasee(el, nm);
          var tag = h('span', { class: 'bdr-axtag' + (ecrase ? ' beat' : ''), text: nm,
            title: ecrase
              ? 'Cette classe ne peint pas ici : la page sert ' + ecrase.servi.toFixed(1)
                + ' px au lieu des ' + ecrase.attendu.toFixed(1) + ' px du cran. '
                + 'Une règle plus spécifique gagne.'
              : (at ? atomLabel(at) : nm) });
          if (ecrase) {
            tag.appendChild(h('span', { class: 'bdr-axbeat',
              text: '⚠ ' + ecrase.servi.toFixed(0) + 'px' }));
          }
          if (a.multiple) {
            tag.appendChild(h('span', { class: 'bdr-axoff', text: '×', title: 'Retirer ce mod',
              onclick: function (ev) { ev.stopPropagation(); commitRemoveAtom(nm); } }));
          }
          vals.appendChild(tag);
        });
      } else {
        vals.appendChild(h('span', { class: 'bdr-axnone',
          text: manquants.indexOf(a.key) !== -1 ? 'manquant, hérité du parent' : '—' }));
      }
      row.appendChild(vals);
      row.appendChild(h('span', { class: 'bdr-axgo', text: a.multiple ? '+' : '✎',
                                  title: a.multiple ? 'Ajouter un mod' : 'Changer' }));
      row.addEventListener('click', function () { showAxisPicker(a.key); });
      box.appendChild(row);
    });

    // ce qui n'entre dans aucun axe : crans d'avant, composants, roles
    var hors = read.legacy.concat(read.roles, read.aliases, read.components, read.utils);
    if (hors.length) {
      var chips = h('div', { class: 'bdr-chips' });
      hors.forEach(function (nm) {
        var r = E.resolve(nm);
        var col = r.category === 'component' ? '#38bdf8'
                : r.category === 'util' ? '#2dd4bf'
                : '#fbbf24';                       // cran d'avant, alias, role
        var ch = chip(nm, col);
        ch.title = r.atoms ? '→ ' + r.atoms.join(' ') : (r.group || '');
        chips.appendChild(ch);
      });
      box.appendChild(chips);
    }
    return box;
  }

  /* ---- changer UN axe (liste courte, apercu au survol) ------------------- */
  function showAxisPicker(axis) {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var a = (CAT.axes || []).filter(function (x) { return x.key === axis; })[0] || { label: axis };
    var courant = readEl(selected);
    var groups = optionsForAxis(axis, curveOf(selected));
    var search = h('input', { id: 'bdr-search', placeholder: 'Filtrer…' });
    var list = h('div', {});

    function optEl(at) {
      var pose = a.multiple ? courant[axis].indexOf(at.name) !== -1 : courant[axis] === at.name;
      var opt = h('div', { class: 'bdr-opt' + (pose ? ' on' : ''), text: atomLabel(at) });
      opt.addEventListener('mouseenter', function () { previewAtom(at.name); });
      opt.addEventListener('mouseleave', function () { restorePreview(); });
      opt.addEventListener('click', function () { commitAtom(at.name); dynBox.innerHTML = ''; });
      return opt;
    }
    function fill(q) {
      list.innerHTML = '';
      groups.forEach(function (g) {
        var items = g.items.filter(function (it) {
          return !q || atomLabel(it).toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        if (!items.length) return;
        if (groups.length > 1) list.appendChild(h('div', { class: 'bdr-optgroup', text: g.title }));
        items.forEach(function (it) { list.appendChild(optEl(it)); });
      });
      if (!list.children.length) list.appendChild(h('div', { class: 'bdr-empty', text: 'Aucun atome ne correspond.' }));
    }
    search.addEventListener('input', function () { fill(search.value.trim()); });

    dynBox.appendChild(h('div', { class: 'bdr-bld-t', text: '🔁 ' + a.label }));
    // un axe facultatif se retire : c'est un etat legitime, pas un oubli
    if (!a.required && !a.multiple && courant[axis]) {
      var pose = courant[axis];
      var off = h('div', { class: 'bdr-opt off', text: '⌀  Retirer ' + pose });
      off.addEventListener('mouseenter', function () { previewWithout(pose); });
      off.addEventListener('mouseleave', function () { restorePreview(); });
      off.addEventListener('click', function () { commitRemoveAtom(pose); dynBox.innerHTML = ''; });
      dynBox.appendChild(off);
    }
    dynBox.appendChild(search); dynBox.appendChild(list); fill(''); search.focus();
  }

  /* ---- builder : une TAILLE neuve ----------------------------------------
   *
   * Ce n'est plus un builder de STYLE, et ce n'est pas un raccourci de nommage :
   * le DS a clos quatre axes sur cinq. Les fontes sont les cinq du site, les
   * couleurs les huit tokens, les mods deux plus les interlignes. Le seul axe
   * qui s'etend encore est la TAILLE, et `ds/_atomes.scss` le dit :
   * « le lot 2 ne cree AUCUN atome de taille » parce que la regle du min en
   * faisait toujours retomber sur un existant.
   *
   * DEUX REGLES QUE CE PANNEAU FAIT RESPECTER, pas seulement affiche :
   *   1. `min = max - 3`, sur le TEXTE uniquement. Les titres gardent leur min
   *      ecrit a l'appel (decision Manuel du 22.08 : « je veux pas que tu
   *      changes les title »), donc le champ min y est libre et obligatoire.
   *   2. Ecrire un min de texte a la main est une EXCEPTION, et une exception
   *      doit porter un commentaire qui parle DU MIN. Sur douze exceptions
   *      declarees dans le DS, neuf etaient blanchies par un texte qui parlait
   *      d'autre chose ; le champ est donc obligatoire ici, et il part au
   *      rapport avec le SCSS.
   */
  function showBuilder() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');

    var read = readEl(selected);
    var courant = read.s && E.parseAtom(read.s);
    var st = {
      curve: courant ? courant.curve : curveOf(selected),
      max: courant ? courant.max : null,
      min: null,             // null = deduit par la regle (texte) ou a saisir
      exception: ''
    };

    var wrap = h('div', { class: 'bdr-bld' });
    var nameEl = h('div', { class: 'bdr-name', text: '—' });
    var statusEl = h('div', { class: 'bdr-status' });
    var actionEl = h('div', {});
    var scssEl = h('div', { class: 'bdr-scss' });
    var curvesBox = h('div', { class: 'bdr-fams' });
    var maxIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'max', min: '1' });
    var minIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'min', min: '1' });
    var minHint = h('span', { class: 'bdr-hint', text: '' });
    var excIn = h('input', { class: 'bdr-role', placeholder: 'Pourquoi ce min ? (obligatoire pour une exception)' });
    var excRow = h('div', { style: 'display:none' }, excIn);
    var chipsBox = h('div', { class: 'bdr-sizechips' });

    var CURVES = [
      { key: 'text', label: 'Texte' }, { key: 'cta', label: 'CTA' },
      { key: 'title', label: 'Titre' }, { key: 'banner', label: 'Bannière' },
      { key: 'fixed', label: 'Fixe (px)' }
    ];
    CURVES.forEach(function (cv) {
      var b = h('div', { class: 'bdr-fam' + (cv.key === st.curve ? ' on' : ''), text: cv.label, title: cv.key });
      b.addEventListener('click', function () {
        st.curve = cv.key;
        Array.prototype.forEach.call(curvesBox.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on');
        update();
      });
      curvesBox.appendChild(b);
    });

    maxIn.addEventListener('input', function () { st.max = maxIn.value ? +maxIn.value : null; update(); });
    minIn.addEventListener('input', function () { st.min = minIn.value ? +minIn.value : null; update(); });
    excIn.addEventListener('input', function () { st.exception = excIn.value.trim(); update(); });

    var bldSaved = null;
    function previewSize(name) {
      if (!bldSaved) { bldSaved = new Map(); targets().forEach(function (el) { bldSaved.set(el, classAttr(el)); }); }
      applyToTargets(function (el) { applyAtomTo(el, name); });
    }
    function restoreBld() {
      if (bldSaved) {
        bldSaved.forEach(function (v, el) { el.setAttribute('class', v); });
        bldSaved = null;
        if (selected) { markSelected(selected); boxAt(selBox, selected); }
        paintMulti();
      }
    }

    // les tailles deja servies par cette rampe : l'anti-doublon, et le seul
    // moyen de voir qu'un cran existe deja avant d'en creer un douzieme
    function refreshChips() {
      chipsBox.innerHTML = '';
      E.sizesByCurve(st.curve).sort(function (a, b) { return b.max - a.max; }).forEach(function (a) {
        var c = h('span', { class: 'bdr-sc exists', text: a.max + (a.curve === 'fixed' ? '' : '→' + a.min),
                            title: a.name + ' existe déjà' });
        c.addEventListener('click', function () {
          maxIn.value = a.max; st.max = a.max;
          minIn.value = a.min; st.min = a.min;
          update();
        });
        chipsBox.appendChild(c);
      });
    }

    function update() {
      refreshChips();
      var regle = E.minDuCran(st.max, st.curve);      // null hors du texte
      var fixe = st.curve === 'fixed';
      minIn.disabled = fixe;
      minHint.textContent = fixe ? 'taille fixe : pas de min'
        : (regle != null ? 'règle du min : ' + (st.max || '…') + ' − ' + E.minPx + ' = ' + (regle == null ? '…' : regle)
                         : 'les titres n\'ont pas de règle : le min se choisit');
      var min = fixe ? st.max : (st.min != null ? st.min : regle);
      var exception = !fixe && regle != null && min != null && min !== regle;
      excRow.style.display = exception ? 'block' : 'none';

      actionEl.innerHTML = ''; scssEl.textContent = '';
      if (!st.max || min == null) {
        nameEl.textContent = '—';
        statusEl.textContent = 'Choisis une rampe et une taille max.';
        statusEl.className = 'bdr-status';
        return;
      }
      var name = E.sizeAtomName(st.max, min, st.curve);
      nameEl.textContent = name;
      var existe = E.findSize(st.max, min, st.curve);
      scssEl.textContent = E.scssForSize(name, st.max, min, st.curve);

      if (existe) {
        statusEl.className = 'bdr-status exists';
        statusEl.textContent = '✓ ' + existe.name + ' existe déjà — autant le réutiliser.';
        previewSize(existe.name);
        var b1 = h('button', { class: 'bdr-cta', text: 'Utiliser ' + existe.name });
        b1.addEventListener('click', function () {
          restoreBld(); dynCleanup = null; commitAtom(existe.name); dynBox.innerHTML = '';
        });
        actionEl.appendChild(b1);
        return;
      }

      statusEl.className = 'bdr-status new';
      statusEl.textContent = exception
        ? '⚠️ Exception à la règle du min — à justifier par écrit.'
        : '✨ Nouvelle taille — aperçu appliqué en direct.';
      injectStyle(name); previewSize(name);
      var b2 = h('button', { class: 'bdr-cta', text: 'Créer et appliquer' });
      if (exception && !st.exception) { b2.disabled = true; b2.title = 'Une exception doit dire pourquoi.'; }
      b2.addEventListener('click', function () {
        restoreBld(); dynCleanup = null;
        var scss = E.scssForSize(name, st.max, min, st.curve);
        createdStyles[name] = scss;
        commitAtom(name, { new_size: {
          name: name, curve: st.curve, max: st.max, min: min,
          exception: exception ? st.exception : null,
          scss: scss, css: E.synthSizeCSS(name, st.max, min, st.curve, false)
        } });
        dynBox.innerHTML = '';
      });
      actionEl.appendChild(b2);
    }

    wrap.appendChild(h('div', { class: 'bdr-bld-t', text: '➕ Nouvelle taille' }));
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Rampe' })); wrap.appendChild(curvesBox);
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Max (à 1920 px et au-delà) — px' }));
    wrap.appendChild(h('div', { class: 'bdr-sizerow' }, maxIn));
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Min (à 361 px et en dessous) — px' }));
    wrap.appendChild(h('div', { class: 'bdr-sizerow' }, minIn, minHint));
    wrap.appendChild(excRow);
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Tailles déjà servies par cette rampe' }));
    wrap.appendChild(chipsBox);
    wrap.appendChild(h('div', { class: 'bdr-preview' }, nameEl, statusEl));
    wrap.appendChild(scssEl);
    wrap.appendChild(actionEl);
    dynBox.appendChild(wrap);
    dynCleanup = restoreBld;

    if (st.max != null) maxIn.value = st.max;
    update();
  }

  /* ---- note (n'importe quel element, dont icones) ------------------------ */
  function showNote() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var d = describe(selected);
    var ph = d.resource ? 'Ex : « Utilise cette icône : … » ou « Remplace par … »' : 'Changement souhaité, remarque…';
    var ta = h('textarea', { id: 'bdr-note', placeholder: ph });
    var save = h('button', { class: 'bdr-btn', text: 'Enregistrer la note',
      onclick: function () { if (ta.value.trim()) record(selected, 'note', { note: ta.value.trim() }); dynBox.innerHTML = ''; toast('Note enregistrée'); } });
    dynBox.appendChild(ta); dynBox.appendChild(save); ta.focus();
  }

  /* ---- vue Rapport ------------------------------------------------------- */
  function showReport() { clearDyn(); view = 'report'; expand(); renderSelected(); }
  function renderReport() {
    selCard.className = ''; selCard.innerHTML = ''; verbsBox.innerHTML = ''; dynBox.innerHTML = '';
    var rep = h('div', { class: 'bdr-rep' });
    rep.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ds', text: 'Modifications · ' + feedbacks.length }),
      h('span', { class: 'bdr-x', text: '×', title: 'Revenir à la revue', onclick: function () { view = 'review'; renderSelected(); } })));

    if (touchedEls.length) {
      rep.appendChild(h('div', { class: 'bdr-rep-ba' },
        h('div', { class: 'bdr-ba' + (!showAfter ? ' on' : ''), text: 'Avant', onclick: function () { applyBA(false); renderReport(); } }),
        h('div', { class: 'bdr-ba' + (showAfter ? ' on' : ''), text: 'Après', onclick: function () { applyBA(true); renderReport(); } })));
    }

    if (!feedbacks.length) {
      rep.appendChild(h('div', { class: 'bdr-empty', text: 'Aucune modification pour l’instant. Sélectionne un élément et propose un changement.' }));
    } else {
      var curPage = null;
      feedbacks.forEach(function (fb, i) {
        if (fb.url !== curPage) { curPage = fb.url; rep.appendChild(h('div', { class: 'bdr-rep-pg', text: fb.url })); }
        var icon = { swap: '🔁', create: '➕', migrate: '♻️', note: '📝' }[fb.verdict] || '•';
        var to = fb.verdict === 'note' ? (fb.note || '')
               : fb.verdict === 'migrate' ? (fb.atoms_after || []).join(' ')
               : (fb.proposition || fb.retire || (fb.atoms_after || []).join(' '));
        var main = h('div', { class: 'bdr-rep-main' },
          h('div', { class: 'to', text: (fb.group ? '[' + fb.group.count + '×] ' : '') + (to || '') }),
          h('div', { class: 'anc', text: '<' + fb.tag + '> ' + (fb.text_anchor || fb.css_path || '').slice(0, 44) }));
        rep.appendChild(h('div', { class: 'bdr-rep-row' },
          h('span', { class: 'bdr-rep-v', text: icon }), main,
          h('span', { class: 'bdr-rep-del', text: '×', title: 'Retirer', onclick: function () { removeFeedback(i); renderReport(); } })));
      });
    }

    rep.appendChild(h('button', { class: 'bdr-lock', text: pageLocked ? '↻ Reprendre la revue de cette page' : '🔒 Verrouiller la page (revue terminée)', onclick: function () { toggleLock(); } }));
    if (feedbacks.length) rep.appendChild(h('button', { class: 'bdr-clear', text: 'Vider le rapport', onclick: function () { if (confirm('Effacer toutes les modifications enregistrées (toutes pages) ?')) { clearReport(); renderReport(); } } }));
    dynBox.appendChild(rep);
  }
  function toggleLock() {
    pageLocked = !pageLocked;
    if (pageLocked) {
      applyBA(true); pausedShowAfter = true;   // le verrou fige volontairement la page sur les propositions
      reviewMode = false; unpaint(); clearHover(); unmarkSelected();
      document.documentElement.removeAttribute('data-bdr-live');
      selected = null; selPath = null; selBox.style.display = 'none'; clearMulti(); clearOne();
      view = 'review'; syncState(); renderSelected();
      toast('Page verrouillée — navigue vers la suivante');
    } else { toast('Revue reprise'); renderReport(); }
  }

  /* ---- barre / divers ---------------------------------------------------- */
  function renderRes() { resBadge.textContent = breakpoint() + ' ' + innerWidth + '×' + innerHeight; }
  function renderTray() { countBadge.textContent = 'Modifications enregistrées · ' + feedbacks.length; }
  // Etat ouvert/replie memorise (sessionStorage) pour que le panneau garde sa
  // position au fil des navigations : le userscript se re-injecte a chaque page
  // et bootait toujours replie -> il "se fermait" a chaque navigation.
  function collapse() { panel.classList.add('collapsed'); reopen.style.display = 'block'; try { sessionStorage.setItem('bdr_open', '0'); } catch (e) {} }
  function expand() { panel.classList.remove('collapsed'); reopen.style.display = 'none'; try { sessionStorage.setItem('bdr_open', '1'); } catch (e) {} }

  function exportJSON() {
    var payload = {
      tool: 'biences-design-review', version: '0.31.0',
      site: location.hostname, exported_at: new Date().toISOString(),
      ds: { nomenclature: CAT.nomenclature, source: CAT.source },
      created_sizes: createdStyles, feedbacks: feedbacks
    };
    var data = JSON.stringify(payload, null, 2);
    try { navigator.clipboard && navigator.clipboard.writeText(data); } catch (e) {}
    var blob = new Blob([data], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: 'review_' + location.hostname + '_' + feedbacks.length + '.json' });
    root.appendChild(a); a.click(); a.remove();
    toast(feedbacks.length + ' modification(s) exportée(s)');
  }

  // ─── Compat tiroirs <dialog> (menu responsive...) : beaucoup de ces tiroirs se
  // ferment « au clic exterieur » en testant dialog.contains(cible). Un clic dans
  // le panneau BDR echouait ce test (le panneau est hors du dialog) -> le tiroir
  // se fermait des qu'on touchait le panneau (y compris le bouton « Demarrer la
  // revue » AVANT que la revue soit active). On patche contains() des <dialog>
  // pour que les noeuds du panneau BDR comptent comme INTERNES : cliquer l'UI du
  // BDR ne ferme jamais un tiroir. Le panneau ne bouge pas (pas de re-parentage
  // -> pas de casse de position:fixed sous un ancetre transforme, header sticky).
  // Generique (tout <dialog>) ; n'affecte que les contains() portant sur des
  // noeuds BDR ; ESC / clic hors panneau ferment toujours normalement.
  function patchDialogs() {
    var origContains = Node.prototype.contains;
    document.querySelectorAll('dialog').forEach(function (d) {
      if (d.__bdrContains) return;
      d.__bdrContains = true;
      d.contains = function (n) { return origContains.call(this, n) || root.contains(n); };
    });
  }

  // En pause, la page doit s'afficher comme si le script n'etait pas la : on retire
  // toutes les marques de revue (pointilles, cadres, cerclages, propositions
  // appliquees, feuille des styles crees) sans rien detruire du travail en cours,
  // et la reprise remet tout en place.
  function toggle() {
    reviewMode = !reviewMode;
    if (reviewMode) {
      pageLocked = false; expand();
      document.documentElement.setAttribute('data-bdr-live', '');
      if (newStyleSheet) newStyleSheet.disabled = false;
      applyBA(pausedShowAfter); paint();
    } else {
      clearDyn();                       // avant applyBA : restorePreview reecrit l'etat "apres"
      pausedShowAfter = showAfter; applyBA(false);
      if (newStyleSheet) newStyleSheet.disabled = true;
      document.documentElement.removeAttribute('data-bdr-live');
      unpaint(); clearHover(); unmarkSelected();
      selected = null; selPath = null; selBox.style.display = 'none';
      clearMulti(); clearOne(); collapse();
    }
    syncState(); renderSelected();
  }

  /* ---- hover -------------------------------------------------------------- */
  var hovered = null;
  function setHover(el) { hovered = el; boxAt(hovBox, el); }
  function clearHover() { hovered = null; hovBox.style.display = 'none'; hoverLine.innerHTML = 'Survole un élément…'; }
  function showHoverInfo(el) {
    var c = classify(el);
    var names = c.ds.map(canonOf);
    var txt = '&lt;' + el.tagName.toLowerCase() + '&gt; ';
    if (names.length) txt += names.join(', ');
    else {
      var base = '— sans style —';
      var anc = nearestStyled(el);
      if (anc) txt += base + ' <span class="up">↑ ' + anc.tagName.toLowerCase() + ' ' + classify(anc).ds.map(canonOf).join(',') + '</span>';
      else txt += base;
    }
    hoverLine.innerHTML = txt;
  }

  /* ---- listeners ---------------------------------------------------------- */
  document.addEventListener('mouseover', function (e) {
    if (!reviewMode) return;
    if (multiGroup) paintMulti();   // rafraichit les boites (les caches -> disparaissent proprement)
    if (e.target.closest && e.target.closest('#bdr-root')) { clearHover(); return; }
    if (e.target === selected) { hovBox.style.display = 'none'; hovered = null; return; }
    setHover(e.target); showHoverInfo(e.target);
  }, true);
  document.addEventListener('click', function (e) {
    if (!reviewMode) return;
    if (e.target.closest && e.target.closest('#bdr-root')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    lastStack = document.elementsFromPoint(e.clientX, e.clientY).filter(function (el) { return !(el.closest && el.closest('#bdr-root')); });
    select(e.target);
  }, true);
  ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) return;
      e.stopImmediatePropagation();
    }, true);
  });
  document.addEventListener('submit', function (e) {
    if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) return;
    e.preventDefault(); e.stopImmediatePropagation();
  }, true);
  addEventListener('resize', function () { renderRes(); if (!reviewMode) return; paint(); if (selected) { markSelected(selected); boxAt(selBox, selected); } boxAt(hovBox, hovered); paintMulti(); });
  addEventListener('scroll', function () { if (!reviewMode) return; if (selected) boxAt(selBox, selected); if (hovered) boxAt(hovBox, hovered); paintMulti(); }, true);
  addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); toggle(); return; }
    if (reviewMode && e.key === 'Escape') {
      if (inField()) { document.activeElement.blur(); return; }
      if (dynBox.firstChild) { clearDyn(); renderSelected(); }
      else if (selected) deselect();
      return;
    }
    if (!reviewMode || inField() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!selected) return;
    var k = e.key.toLowerCase();
    // un raccourci par axe : f fonte, t taille, c couleur, m mod, h survol
    var RACC = { f: 'f', t: 's', c: 'c', m: 'm', h: 'h' };
    if (RACC[k]) { e.preventDefault(); showAxisPicker(RACC[k]); }
    else if (k === 'x') { e.preventDefault(); showBuilder(); }
    else if (k === 'n') { e.preventDefault(); showNote(); }
    else if (k === 'g') { e.preventDefault(); cibleGroupe(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); navUp(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); navDown(); }
  });

  /* ---- boot --------------------------------------------------------------- */
  root.appendChild(style); root.appendChild(hovBox); root.appendChild(selBox); root.appendChild(oneBox); root.appendChild(multiLayer); root.appendChild(panel); root.appendChild(reopen); root.appendChild(toastEl);
  document.body.appendChild(root);
  // Patche les <dialog> presents + ceux qui apparaissent/s'ouvrent ensuite
  // (attribut open), pour la compat "clic exterieur" (cf. patchDialogs).
  patchDialogs();
  try { new MutationObserver(patchDialogs).observe(document.documentElement, { attributes: true, attributeFilter: ['open'], childList: true, subtree: true }); } catch (e) {}
  buildTokens(); resolveColors(); buildFonts(); loadReport();
  renderRes(); renderTray(); syncState(); renderSelected();
  // Applique l'etat initial (cote docke gauche + ouvert/replie memorise) SANS
  // animer : le panneau est cree en 'collapsed' (transform a DROITE) puis setDock
  // le passe a GAUCHE ; transition active, le panneau replie glisserait a travers
  // l'ecran a CHAQUE chargement de page (retour Manuel). On coupe la transition
  // pendant TOUTE la mise en place, puis on la reactive pour les toggles utilisateur.
  var bootOpen = false; try { bootOpen = sessionStorage.getItem('bdr_open') === '1'; } catch (e) {}
  panel.style.transition = 'none';
  setDock(dockLeft);
  (bootOpen ? expand : collapse)();
  void panel.offsetWidth;          // reflow : fige l'etat sans transition
  panel.style.transition = '';     // reactive l'animation pour les ouvertures/fermetures manuelles

  // API de recette. Elle expose les GESTES, pas seulement l'etat : sans elle,
  // une mesure runtime doit reimplementer l'application d'un atome et finit par
  // valider sa propre copie plutot que le code servi.
  window.__bdr = {
    toggle: toggle, get feedbacks() { return feedbacks; },
    export: exportJSON, clear: clearReport, setDock: setDock,
    engine: E, catalog: CAT, colors: colors,
    select: select, applyAtom: applyAtomTo, removeAtom: removeAtomFrom,
    migrate: migrateEl, read: readEl, axisPicker: showAxisPicker, builder: showBuilder
  };
  console.log('[BDR] v0.31.0 prêt — en pause, ' + feedbacks.length + ' modif(s) en mémoire. Onglet « ◀ Design Review » sur le bord GAUCHE (à mi-hauteur), ou Alt+R.');
})();
