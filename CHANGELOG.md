# Changelog
___

### 05-07-2021 - 09-07-2021

- [x] fix#ER-648  : Handle JWT Token Error on every page and redirect the user to login/registration page as per the flow in settings.
- [x] feat#CGSC-9 : Credit Suisse fonts apply
- [x] fix#ER-650  : Missing translation on error message in forgot password page
- [x] feat#ER-656 :
  - Make visible operator role while login as super admin on User listing page
  - Make visible Administrator menu to support user and can access only user listing page
  - Unlink feature: If a user belonging to multiple auto-generated groups, can be removed from current container

- [x] fix#ER-606  : Reader should not be allowed to write any comment on QA
- [x] fix#ER-607  : Reader should not able to create event
- [x] feat#ER-641 : Hardcode login and on-boarding background image for csgsc.virtual.credit-suisse.com
- [x] feat#ER-647 : Whenever we change the language either from session, or from navigation menu, it should also set into our profile
- [x] fix#ER-648  : Handle JWT invalid/expired token error handling
- [x] fix#ER-557  : In session detail page, if there are no data in sections, we should not show them completely.
- [x] fix#ER-443  : Deleting image from 3d panel should ask for confirmation
- [x] fix#ER-552  : Currently delete door image is not deleting image, either it should work or we should not show the button.
- [x] fix#ER-434  : After creating 3D elements, it always return back to rooms page, it should show listing page of that respective elements.
- [x] fix#ER-592  : Full role is not visible for attendeeTESTED AND READY FOR REVIEW
- [x] fix#ER-598  : Date and time UI selection breaks while creating sessionTESTED AND READY FOR REVIEW
- [x] fix#ER-523  : Clicking on start conversation scrolls to top and then after some delay it opens the chat window for conversationTESTED AND READY FOR REVIEW
- [x] fix#ER-435  : Arrow icon should not overlap text in navigation menuREADY FOR TESTING
- [x] fix#ER-524  : Whole strip should be clickable for chat windowTESTED AND READY FOR REVIEW
- [x] fix#ER-462  : Live badge and archived badge should be there on related events
- [x] fix#ER-491  : Speakers and moderators with SHOW MORE should be shown in a popup with search and hover feature as per figma
- [x] fix#ER-559  : Change the whole import process
- [x] fix#ER-540  :
  - Beautify Picture in Picture
  - Beautify confirmation box and stuff


### 12-07-2021 - 16-07-2021

- [x] fix#ER-717  :  Chat enable/disable after detecting feature, role and flags
  - Hide when "Display as Guest" checked
  - Hide when "Allow communication" is un-checked
  - Hide when login user is "READER" role
  - Hide when chat feature is disabled from admin
- [x] fix#ER-710  :  Openexchange/knovio player PIP opens just a white window , stream doesn't work
- [x] fix#ER-711  :  Knovio player has "black bars" on top and bottom of the stream
- [x] fix#ER-701  :  Change position of delete button
- [x] fix#ER-704  :  style issue in smaller screen agenda
- [x] fix#ER-700  :  Loader in chat window not showing properly
- [x] fix#ER-706  :  In privacy settings, show the label on right side of toggle
- [x] feat#ER-674 :  Info Page Crud Operation
- [x] feat#ER-678 :  Navigation Crud Operations
  - Dynamic navigation render
- [x] fix#ER-706  :  In privacy settings, show the label on right side of toggle
- [x] fix#ER-581  :  Timer not updating values, it updates only after refreshing
- [x] fix#ER-688  :  Flag css class .chi change with .zh
- [x] feat#ER-686 :  User can delete his profile
- [x] fix#ER-376  :  Issue in image cropper
- [x] fix#ER-682  :  Linebreak for no reason
- [x] fix#ER-683  :  Session details don't take formatting
- [x] fix#ER-684  :
  - Display as guest user should not visible in attendee list and chat-box
  - Also hide displayAsGuest privacy option for Speaker and Moderator  on Profile and  On-Boarding pages
- [x] feat#ER-679 : Reset password email action on listing
- [x] fix#ER-605  : Many times when we try to edit the session, title, description and URL are not getting populated
- [x] fix#ER-672  : For create session, text label should be on the right side as per figma for each toggles
- [x] fix#ER-667  : add chinese language icon / flag
- [x] fix#ER-638  : In chat options, there should be proper spacing for all the options,  also shadow is missing
- [x] fix#ER-673  : Correct the attendee options drop-down as per figma
- [x] fix#ER-671  : While creating session, date and time picker always goes out of the page and need to scroll every time horizontally
- [x] fix#ER-635  : Icon is not proper for delete button in 3d elements' image section, it should be in center
- [x] fix#ER-376  : Issue in image cropper
- [x] fix#ER-594  : When job title is big, it breaks  the UI in chat window
- [x] fix#ER-464  : Pop-up designs not as per figma
- [x] no related issues to below changes from PR#146
  - cam orbit update on change to keep camera horizontal
  - updated animation times
  - added rotation correction
  - conversion to radians

### 17-07-2021 - 24-07-2021

- [x] feat#SOW5-51 : Dynamic Design Frontend Integration
  - Define CSS variables for the root element
  - Remove duplicate variable and screen-size definition files
  - Define a way to render CSS variables to compile dynamic CSS
  - Improve Design UI
  - Add Color Picker component
  - Add Image Picker component
  - Inject Overwrite CSS and dynamic CSS into DOM, after save
  - Action button to add  Cron job using Queue
  - Image and logo are always rectangles while cropping, allow free form
  - Selections are not getting set on the design section page.
  - Login/OnBoarding page background
  - Static URL based Logo and background  removed

- [x] feat#SOW5-52 : Dynamic Design UI Integration
- [x] fix#SOW5-92  : Sometimes we have double audio from a stream
- [x] fix#ER-653   : Starting Position Rotation doesnt work
- [x] fix#SOW5-87  : Profile related fixes
   - Company and Job title should be on different lines
   - Job title maximum 2 lines
   - Bio data should be rendered as it is with line breaks
- [x] fix#SOW5-85  : Navigation menu not changing language based on user selection
- [x] feat#TGEL-4  : Hardcode different logo
- [x] feat#SOW5-65 : There should be a confirmation while removing image from user profile
- [x] fix#SOW5-64  : When we de-activate language from admin, it still shows in Session Page
- [x] fix#SOW5-80  : Page doesn't reload when i switch between two dynamic info pages
- [x] fix#ER-716   : We don't use green and red color please make it gray