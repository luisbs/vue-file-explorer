import { createApp } from "vue"
import Dev from "./serve.vue"
import Explorer from "@/entry"

const app = createApp(Dev)
app.use(Explorer)

app.mount("#app")
