# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
  templateData:
    site:
      title: 'Totem'

      scripts: [
        'scripts/vendor/vendor.js'
        'scripts/main.js'
      ]

      styles: [
        'styles/vendor/vendor.css'
        'styles/main.css'
      ]

    getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title

    plugins:

      gulp:
        writeAfter: []

  collections:
    mdPages: ->
      @getCollection('html').findAllLive({extension: 'md'}).on 'add', (model) ->
          model.setMetaDefaults({layout: 'default'})

    navLinks: ->
      @getCollection('html').findAllLive({isNavLink:true})

  plugins:
    ghpages:
      deployRemote: 'origin'
      deployBranch: 'master'
      outPath: '.'
}

# Export the DocPad Configuration
module.exports = docpadConfig
