# TODO

## Personnel Tracking + Early Intervention
- [x] Locate and verify Early Intervention flag logic in `deriveEarlyInterventionFlagsForEmployees()`.
- [x] Fix navigation crash: `ComplaintsView` references `createComplaint` but it is not defined in `src/main.jsx` (wired to existing `submitComplaint`).
- [ ] Ensure personnel profile fields (Name, Rank, Badge number, Assignment, Division, Supervisor) render correctly and persist.
- [ ] Wire personnel history (Previous complaints, Previous investigations, Sustained findings, Disciplinary history, Commendations, Training records) into the data model and UI (currently placeholder arrays).
- [ ] Validate/adjust early intervention flag computation for the 5 required flag types.

## Follow-up runtime errors
- [ ] Re-test create case flow after any changes.

