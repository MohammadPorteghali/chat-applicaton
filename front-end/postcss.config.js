/* eslint-disable prettier/prettier */
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/stylesglobal.scss";`
            }
        }
    },
    plugins: {
        autoprefixer: {}
    }
}
