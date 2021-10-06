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
        - `button[data-layout]` - table

  - `div.vfe-content`

    - `* div.vfe-cards`

      - **cards-folders** `{ folders, tree }`

        - `div.vfe-folder`

          - **cards-folder** `{ id, data, tree }`

            - `button[data-open]` - id

      - **cards-files** `{ files }`

        - `div.vfe-file`

          - **cards-file** `{ id, data }`

            - `span` - id

    - `* table.vfe-table`

      - `thead.vfe-header`

        - **table-header**

          - `tr`

            - `th` - Id
            - `th` - Actions

      - `tbody.vfe-content`

        - **table-folders** `{ folders, tree }`

          - `tr.vfe-folder`

            - **table-folder** `{ id, data, tree }`

              - `td` - id
              - `td.vfe-actions`

                - `button[data-open]` - Abrir
                - `button[data-action="rename"]` - Renombrar
                - `button[data-action="delete"]` - Eliminar

        - **table-files** `{ files }`

          - `tr.vfe-file`

            - **table-file** `{ id, data }`

              - `td` - id
              - `td.vfe-actions`

                - `button[data-open]` - Abrir
                - `button[data-action="rename"]` - Renombrar
                - `button[data-action="delete"]` - Eliminar
