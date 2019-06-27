require! {
    \react
    \../newseed-funcs.ls
}
.newseed
    @import scheme
    padding-top: 50px
    width: 100%
    height: $height
    box-sizing: border-box
    height: 100%
    .title
        color: #ebf6f8
        font-size: 35px
        margin-bottom: 20px
    textarea
        width: 100%
        height: 100px
        border-radius: 3px
        resize: none
        padding: 10px
        font-size: 17px
        border: 1px solid #CCC
        text-align: center
        outline: none
        &:focus
            border-color: #248295
    button
        outline: none
        width: 125px
        margin: 5px
        height: 26px
        border: 0
        cursor: pointer
        background: #248295
        border-radius: 20px
        font-size: 15px
        color: white
        &:hover
            background: #248295 - 20
    .hint
        color: #f2eeee
        padding: 20px 38px
newseed = ({ store })->
    { generate-seed, change-seed, save } = newseed-funcs store
    .newseed.pug
        .title.pug New Seed Phrase
        textarea.pug(value="#{store.current.seed}" on-change=change-seed placeholder="Click Generate or Put Your Seed Phrase here")
        .pug
            button.pug.left(on-click=generate-seed) Generate
            button.pug.right(on-click=save) Save
        .pug.hint The phrase is stored securely on your computer. Do not transfer it to a third party and keep the duplicate in a safe place.
focus = (store, cb)->
    <- set-timeout _, 1000
    textarea = store.root.query-selector '.newseed textarea'
    textarea.focus!
    cb null
newseed.focus = focus
module.exports = newseed