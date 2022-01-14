import styles from "./scss/index.css";

/**
 *
 */
class BiitsUploader {
    /**
     * Contiendra les configurations de l'objet
     * @access private
     * @type {object}
     */
    #config
    /**
     * Configurations par défaut de la classe
     * @access private
     * @type {object}
     */
    #defaultConfig = {
        target : '.input-biits-uploader',
        mutliple : false,
        locale : 'fr',
        allowedOrientation : 'all', // all|square|portait|landscape
        allowedType : 'image/gif, image/png, image/jpeg, image/bmp, image/webp', // 'image/gif, image/png, image/jpeg, image/bmp, image/webp, image/svg+xml'
        maxFileSize : 0,
        minAllowedWidth: 0,
        maxAllowedWidth: 0,
        minAllowedHeight: 0,
        maxAllowedHeight: 0,
        nodes : {
            parentNode : 'z-biits-uploader',
            textNode : 't-biits-uploader',
            noticeNode : 'n-biits-uploader',
            inputNode : 'i-biits-uploader',
            messageStatusNode : 'ms-biits-uploader',
            previewNode : 'p-biits-uploader',
            rmNode : 'rm-biits-uploader',
            rmcNode : 'rmc-biits-uploader',
            rmedNode : 'rmed-biits-uploader',
            successNode : 's-biits-uploader'
        },
        i18n : {
            fr : {
                notice : 'Sélectionnez ou glissez / déposez un fichier',
                statusMessage : {
                    orientation : {
                        square : {
                            true : '',
                            false : 'Les dimensions ne respectent pas le format carré'
                        },
                        portrait : {
                            true : '',
                            false : 'Les dimensions ne respectent pas le format portrait'
                        },
                        landscape : {
                            true : '',
                            false : 'Les dimensions ne respectent pas le format paysage'
                        },
                        default : {
                            true : '',
                            false: 'Le format d\'image attendu n\'est pas reconnu'
                        }
                    },
                    sizes : {
                        true : '',
                        false : 'Les dimensions de l\'image ne respectent pas les pré-requis',
                    },
                    size : {
                        true : '',
                        false : 'Le fichier est trop lourd',
                    },
                    type : {
                        true : '',
                        false : 'Le format de fichier n\'est pas autorisé',
                    }
                }
            }
        }
    }

    #orientationStatus

    #sizeStatus

    #typeStatus

    #sizesStatus

    /**
     * Contient l'objet DOM
     * @access private
     * @type {object}
     */
    #targets


    /**
     *
     * @param params
     */
    constructor(params) {
        // Define configuration and variables
        this.#config = {...this.#defaultConfig, ...params}
        this.#targets = document.querySelectorAll(this.#config.target)

        this.#targets.forEach((item) => {
            this.#setup(item);
        });
    }

    /**
     *
     * @param item
     */
    #setup = (item) => {
        this.#createNodes(item)
        this.#eventManager(item)
    }

    /**
     *
     * @param item
     */
    #createNodes = (item) => {
        let parentNode = document.createElement('div')
        parentNode.setAttribute('class', this.#config.nodes.parentNode)
        item.after(parentNode)

        let textNode =  document.createElement('div')
        textNode.setAttribute('class', this.#config.nodes.textNode)
        parentNode.append(textNode)

        let noticeNode = document.createElement('div')
        noticeNode.setAttribute('class', this.#config.nodes.noticeNode)
        noticeNode.innerText = this.#config.i18n[this.#config.locale].notice;
        textNode.append(noticeNode)

        let messageStatusNode = document.createElement('div')
        messageStatusNode.setAttribute('class', this.#config.nodes.messageStatusNode)
        messageStatusNode.classList.add('dn-bu')
        textNode.append(messageStatusNode)

        let previewNode = document.createElement('div')
        previewNode.setAttribute('class', this.#config.nodes.previewNode)
        parentNode.append(previewNode)

        let removeNode = document.createElement('div')
        removeNode.setAttribute('class', this.#config.nodes.rmNode)
        let removeCrossNode = document.createElement('div')
        removeCrossNode.setAttribute('class', this.#config.nodes.rmcNode)
        removeNode.classList.add('dn-bu')
        removeNode.append(removeCrossNode)
        parentNode.append(removeNode)

        let successNode = document.createElement('div')
        successNode.setAttribute('class', this.#config.nodes.successNode)
        successNode.classList.add('dn-bu')
        parentNode.append(successNode)

        let rmedNode = document.createElement('input')
        rmedNode.setAttribute('class', this.#config.nodes.rmedNode)
        rmedNode.setAttribute('name', item.getAttribute('name')+'-is-removed')
        rmedNode.type = 'hidden';
        parentNode.append(rmedNode)

        item.classList.add(this.#config.nodes.inputNode)
        parentNode.appendChild(item)

        this.#setImagePreview(item, item.dataset.file)
    }

    #setImagePreview = (item, url) => {
        if(typeof url == 'undefined' || url == '')
            return;

        item.parentElement.querySelector('.'+this.#config.nodes.previewNode).style.backgroundImage = "url('"+url+"')"

        item.parentElement.querySelector('.'+this.#config.nodes.messageStatusNode).classList.add('dn-bu')
        item.parentElement.querySelector('.'+this.#config.nodes.messageStatusNode).classList.remove('d-bu')

        item.parentElement.querySelector('.'+this.#config.nodes.rmNode).classList.add('d-bu')
        item.parentElement.querySelector('.'+this.#config.nodes.rmNode).classList.remove('dn-bu')

        item.parentElement.querySelector('.'+this.#config.nodes.noticeNode).classList.add('dn-bu')
        item.parentElement.querySelector('.'+this.#config.nodes.noticeNode).classList.remove('d-bu')
    }

    /**
     *
     * @param item
     */
    #eventManager = (item) => {
        item.onchange = (e) => {
            this.#setPreview(item, e)
        }

        item.parentElement.querySelector('.'+this.#config.nodes.rmcNode).addEventListener('click', (e) => {
            item.value = null;
            item.parentElement.querySelector('.'+this.#config.nodes.previewNode).style.backgroundImage = null

            item.parentElement.querySelector('.'+this.#config.nodes.rmNode).classList.add('dn-bu')
            item.parentElement.querySelector('.'+this.#config.nodes.rmNode).classList.remove('d-bu')
            item.parentElement.querySelector('.'+this.#config.nodes.rmedNode).value = true;

            item.parentElement.querySelector('.'+this.#config.nodes.noticeNode).classList.add('d-bu')
            item.parentElement.querySelector('.'+this.#config.nodes.noticeNode).classList.remove('dn-bu')
        })
    }

    /**
     *
     * @param item
     * @param e
     */
    #setPreview = (item, e) => {
        const [file] = item.files
        if (file)
            this.#validateFile(item, file).then((isValid) => {
                if(isValid) {
                    this.#setImagePreview(item, URL.createObjectURL(file))
                } else
                    item.value = null
            })
    }

    /**
     *
     * @param item
     * @param sizes
     */
    #addFormat = (item, sizes) => {
        let format
        switch (this.#config.allowedOrientation) {
            case 'square' :
                format = 'bu-square'
                break;
            case 'portrait' :
                format = 'bu-portrait'
                break;
            case 'landscape' :
                format = 'bu-landscape'
                break;
            case 'all' :
                if(sizes.width === sizes.height)
                    format = 'bu-square'
                if(sizes.width < sizes.height)
                    format = 'bu-portrait'
                if(sizes.width > sizes.height)
                    format = 'bu-landscape'
                break;
            default:
                format = 'bu-cover'
                break;
        }
        this.#removeFormat(item)
        item.parentElement.querySelector('.'+this.#config.nodes.previewNode).classList.add(format)
    }

    /**
     *
     * @param item
     */
    #removeFormat = (item) => {
        item.parentElement.querySelector('.'+this.#config.nodes.previewNode).classList.remove(...[
            'bu-square',
            'bu-portrait',
            'bu-landscape'
        ])
    }

    /**
     *
     * @param item
     * @param file
     * @returns {Promise<boolean>}
     */
    #validateFile = async (item, file) => {
        return await this.#getFileSizes(file).then((value) => {
            let isValid = true
            this.#validateType(file)
            if(!this.#typeStatus.state) isValid = this.#errorManager(item, this.#typeStatus.msg)
            this.#validateSize(file)
            if(!this.#sizeStatus.state) isValid = this.#errorManager(item, this.#sizeStatus.msg)
            this.#validateOrientation(value)
            if(!this.#orientationStatus.state) isValid = this.#errorManager(item, this.#orientationStatus.msg)
            this.#validateSizes(value)
            if(!this.#sizesStatus.state) isValid = this.#errorManager(item, this.#sizesStatus.msg)
            this.#addFormat(item, value);
            return isValid;
        });
    }

    /**
     *
     * @param item
     * @param error
     * @returns {boolean}
     */
    #errorManager = (item, error) => {
        let txtZone = item.parentElement.querySelector('.'+this.#config.nodes.messageStatusNode)
            txtZone.innerText = error
            txtZone.classList.add('d-bu')
            txtZone.classList.remove('dn-bu')
        return false;
    }

    /**
     *
     * @param file
     */
    #validateSize = (file) => {
        const state = !(this.#config.maxFileSize && !(Math.round((file.size / 1024)) < this.#config.maxFileSize))

        this.#sizeStatus = {
            state : state,
            msg : this.#config.i18n[this.#config.locale].statusMessage.size[state]
        }
    }

    /**
     *
     * @param file
     */
    #validateType = (file) => {
        const state = (this.#config.allowedType.split(', ').indexOf(file.type) != -1)

        this.#typeStatus = {
            state: state,
            msg: this.#config.i18n[this.#config.locale].statusMessage.type[state]
        }
    }


    /**
     *
     * @param sizes
     */
    #validateOrientation = (sizes) => {
        let state
        switch (this.#config.allowedOrientation) {
            case "all":
                state = true
                break
            case "square":
                state = (sizes.width === sizes.height)
                break
            case "portrait":
                state = (sizes.width < sizes.height)
                break
            case "landscape":
                state = (sizes.width > sizes.height)
                break
            default:
                state = false
                break
        }

        this.#orientationStatus =  {
            state : state,
            msg : (this.#config.i18n[this.#config.locale].statusMessage.orientation.hasOwnProperty(this.#config.allowedOrientation)) ?
                     this.#config.i18n[this.#config.locale].statusMessage.orientation[this.#config.allowedOrientation][state] :
                        this.#config.i18n[this.#config.locale].statusMessage.orientation.default[state]
        }
    }

    /**
     *
     * @param sizes
     */
    #validateSizes = (sizes) => {
        if(
            this.#config.minAllowedWidth > this.#config.maxAllowedWidth ||
            this.#config.minAllowedHeight > this.#config.maxAllowedHeight
        ) throw new Error('Dimensions are misconfigured, check the documentation')

        let state = (
            (this.#config.minAllowedWidth && !(sizes.width >= this.#config.minAllowedWidth)) || // 12  && 5 >= 12 (true)
            (this.#config.maxAllowedWidth && !(sizes.width <= this.#config.maxAllowedWidth)) || // 50 && !49 <= 50 (false)
            (this.#config.minAllowedHeight && !(sizes.height >= this.#config.minAllowedHeight)) || // 20 && !22 >= 20 (false)
            (this.#config.maxAllowedHeight && !(sizes.height <= this.#config.maxAllowedHeight)) // 150 && !140 <= 150 (false)
        ) ? false : true

        this.#sizesStatus =  {
            state : state,
            msg : this.#config.i18n[this.#config.locale].statusMessage.sizes[state]
        }
    }

    /**
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    #getFileSizes = async (file) => {
        return await new Promise((resolve, reject) => {
            let img = new Image()
            var objectUrl = URL.createObjectURL(file)
            img.onload = function () {
                URL.revokeObjectURL(objectUrl)
                resolve({width: this.width, height: this.height})
            };
            img.src = objectUrl
            img.onerror = reject
        });
    }
}

window.BiitsUploader = BiitsUploader;
export default BiitsUploader