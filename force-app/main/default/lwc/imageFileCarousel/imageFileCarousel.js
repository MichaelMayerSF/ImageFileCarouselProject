import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ERROR_TITLE = 'Error loading related files';
const ERROR_VARIANT = 'error';

export default class ImageFileCarousel extends LightningElement {
    //public
    @api
    height;
    @api
    autoSlideInterval;
    @api
    recordId;

    //private
    cards;
    slideIndex = 1;
    interval;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'ContentDocumentLinks',
        fields: ['ContentDocumentLink.ContentDocument.FileExtension', 'ContentDocumentLink.ContentDocument.LatestPublishedVersionId'],
    })
    getFiles({ error, data }) {
        if (data) {
            let images = data.records.map((record) => {
                return {
                    ext: record.fields.ContentDocument.value.fields.FileExtension.value,
                    Id: record.fields.ContentDocument.value.fields.LatestPublishedVersionId.value,
                    key1: 'ifc-key1' + record.fields.ContentDocument.value.fields.LatestPublishedVersionId.value,
                    key2: 'ifc-key2' + record.fields.ContentDocument.value.fields.LatestPublishedVersionId.value,
                    url: '/sfc/servlet.shepherd/version/download/' + record.fields.ContentDocument.value.fields.LatestPublishedVersionId.value
                }
            });
            images = images.filter(image => image.ext === 'jpg' || image.ext === 'png' || image.ext === 'jpeg');

            for (let i = 0; i < images.length; i++) {
                images[i].counter = (i + 1) + ' / ' + images.length;
            }
            this.cards = images;
        } else if (error) {
            console.log(error);
            let errorMessage = (error.message ? errorMessage : error);
            const toastEvent = new ShowToastEvent({
                title: ERROR_TITLE,
                message: errorMessage,
                variant: ERROR_VARIANT
            });
            this.dispatchEvent(toastEvent);
        }
    }

    get getHeight() {
        return 'height:' + this.height + 'px; object-fit: cover;';
    }


    renderedCallback() {
        console.log('render');
        this.showSlides();
        if (this.autoSlideInterval >= 500 && !this.interval) {
            this.interval = setInterval(() => {
                this.slideIndex++;
                this.showSlides();
            }, this.autoSlideInterval);
        }
    }

    currentSlide(event) {
        this.slideIndex = parseInt(event.target.dataset.ifcSlideIndex) + 1;
        this.showSlides();
    }

    prevSlide() {
        this.slideIndex--;
        this.showSlides();
    }

    nextSlide(n) {
        this.slideIndex++;
        this.showSlides();
    }

    showSlides() {
        let i;
        let slides = this.template.querySelectorAll('.ifc-slides');
        let dots = this.template.querySelectorAll('.ifc-dot');

        if (slides && slides.length > 0) {
            if (this.slideIndex > slides.length) { this.slideIndex = 1 }
            if (this.slideIndex < 1) { this.slideIndex = slides.length }
            for (i = 0; i < slides.length; i++) {
                slides[i].classList.add("slds-hide");
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" ifc-active", "");
            }
            slides[this.slideIndex - 1].classList.remove("slds-hide");
            slides[this.slideIndex - 1].classList.add("slds-show");
            dots[this.slideIndex - 1].className += " ifc-active";
        }
    }
}