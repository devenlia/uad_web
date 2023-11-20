# Release Notes

---

## Dev 1.1.1

### Improvements:

- Fixed a bug that caused unusual behavior when opening the content wizard.
- Enhanced error handling in the backend API.
- Enabled Cross-Origin to run the application in Docker.

### Known Bugs:

- Currently, there is no way to delete links (Not yet implemented).
- Some UI elements lack appropriate margins, which may lead to odd appearances.

---

## Version Dev 1.1.0 (Similar to Release 1.1.0)

### Improvements:

- Improved error handling in "Content Wizard" modals. These improvements help in quickly recognizing and correcting errors, providing users with a better experience. (#5ee43c4b)
- Fixed a bug where deleting a page was not possible because of incorrect ServerSide GET. This means that users can now delete pages without any issues. (#e99bb0c6)
- Overhauled the addition and deletion of content. Users can now use modals instead of actions to add or delete content. This should enhance user experience by making content management easier. (#0e92b7c2)

### Known Bugs:

- There is currently no way to delete links (Not yet implemented).
- There could be strange behavior when launching the Content Wizard.

These changes should significantly improve the user experience. Your feedback matters to us, and we appreciate your continuous support.