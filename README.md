# vue-file-explorer

Emulate a file explorer

# Estructura por defecto

- `div.vue-file-explorer`

  - `div.vfe-bar`

    - `div.vfe-path`

      - **folder-path** `{ path }`

        - `button[data-open]` - parent folder
        - `button[data-open]` - parent folder
        - `button[data-open]` - parent folder

    - `div.vfe-layout`

      - **layout-selector**

        - `button[data-layout]` - Cards
        - `button[data-layout]` - Details

  - `div.vfe-content`

    - `* div.vfe-cards`

      - **cards-folders** `{ folders }`

        - `div.vfe-folder`

          - **cards-folder** `{ id, title, data }`

            - `button[data-open]` - id - title

      - **cards-files** `{ files }`

        - `div.vfe-file`

          - **cards-file** `{ id, title, data }`

            - `span` - id - title

    - `* ul.vfe-details`

      - **details-header**

        - `li.vfe-header`

          - `span` - Id
          - `span` - Name
          - `span` - Actions

      - **details-folders** `{ folders }`

        - `li.vfe-folder`

          - **details-folder** `{ id, title, data }`

            - `span` - id
            - `span` - title

          - **folder-actions** `{ id }`

            - `div.vfe-actions`

              - `span[data-menu]` - Actions
              - `div.vfe-menu`

                - **folder-menu** `{ id }`

                  - `button[data-open]` - Abrir
                  - `button[data-action="rename"]` - Renombrar
                  - `button[data-action="delete"]` - Eliminar

      - **details-files** `{ files }`

        - `li.vfe-file`

          - **details-file** `{ id, title, data }`

            - `span` - id
            - `span` - title

          - **file-actions** `{ id }`

            - `div.vfe-actions`

              - `span[data-menu]` - Actions
              - `div.vfe-menu`

                - **file-menu** `{ id }`

                  - `button[data-open]` - Abrir
                  - `button[data-action="rename"]` - Renombrar
                  - `button[data-action="delete"]` - Eliminar
