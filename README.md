# ImageFileCarousel
A small image carousel LWC using related files in record

## Related files
Uses the **ContentDocumentLinks** linking the files to the current record.

Files are filtered (only png, jpg, jpeg) on the extension registered in: **ContentDocumentLink.ContentDocument.FileExtension**

Images displayed use the published version Id (**ContentDocumentLink.ContentDocument.LatestPublishedVersionId**) and the standard download URL _/sfc/servlet.shepherd/version/download/_.

## Parameters
Two input parameters:
- Height: fixes the height of the images (Images will fill this height even if they overflow on the sides)
- Auto Slide Interval (in ms): a value above 499 will result in the slideshow automatically scrolling from one image to the next
