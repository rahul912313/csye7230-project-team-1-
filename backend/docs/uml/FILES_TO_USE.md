# 📁 DIAGRAM FILES - USAGE GUIDE

## ✅ USE THESE FOR YOUR REPORT (8 Diagrams)

### 1. Use Case Diagram
- **FILE:** `usecase-diagram-clean.puml` ✅
- **STATUS:** Ready to use (fixed title)

### 2. Class Diagram  
- **FILE:** `class-diagram-UPDATED.puml` ✅
- **STATUS:** USE THIS ONE! (Includes BookingRequest model)
- ❌ **DO NOT USE:** `class-diagram-complete.puml` (outdated, missing BookingRequest)

### 3. Activity Diagrams (Choose 2)
- **FILE 1:** `activity-phase1-request.puml` ✅
- **FILE 2:** `activity-phase2-confirm-payment.puml` ✅
- **Alternative:** `activity-diagram-add-vehicle-actual.puml` (if you want to show admin feature)

### 4. Sequence Diagrams (Choose 2)
- **FILE 1:** `sequence-two-phase-booking.puml` ✅ (COMPLETE - shows all phases)
- **FILE 2:** `sequence-add-vehicle.puml` ✅
- ❌ **DO NOT USE:** `sequence-phase1-request.puml` (duplicate - covered in two-phase-booking)
- ❌ **DO NOT USE:** `sequence-phase2-confirm.puml` (duplicate - covered in two-phase-booking)

### 5. State Machine Diagrams (Choose 2)
- **FILE 1:** `statemachine-booking.puml` ✅
- **FILE 2:** `statemachine-transaction.puml` ✅
- **Alternative:** `statemachine-booking-request.puml` (shows TTL expiration)

---

## ❌ FILES TO IGNORE (Redundant/Outdated)

### Outdated:
- ❌ `class-diagram-complete.puml` 
  - **Reason:** Missing BookingRequest model
  - **Replaced by:** class-diagram-UPDATED.puml

### Redundant (Covered in Combined Diagrams):
- ❌ `sequence-phase1-request.puml`
  - **Reason:** Phase 1 already shown in `sequence-two-phase-booking.puml`
  - **Decision:** Use the complete two-phase diagram instead

- ❌ `sequence-phase2-confirm.puml`
  - **Reason:** Phase 2 already shown in `sequence-two-phase-booking.puml`
  - **Decision:** Use the complete two-phase diagram instead

---

## 📋 RECOMMENDED DIAGRAM SET (8 Total)

For your 10-page report, use these 8 diagrams:

1. ✅ `usecase-diagram-clean.puml`
2. ✅ `class-diagram-UPDATED.puml`
3. ✅ `activity-phase1-request.puml`
4. ✅ `activity-phase2-confirm-payment.puml`
5. ✅ `sequence-two-phase-booking.puml`
6. ✅ `sequence-add-vehicle.puml`
7. ✅ `statemachine-booking.puml`
8. ✅ `statemachine-transaction.puml`

**These 8 diagrams show:**
- Complete system overview (use case)
- Full architecture (class)
- Main user flows (activity, sequence)
- Complex state management (state machines)
- Design patterns (shown in class diagram)

---

## 🗑️ OPTIONAL: Delete These Files

If you want to clean up the folder, you can safely delete:

```bash
cd docs/uml
rm class-diagram-complete.puml
rm sequence-phase1-request.puml
rm sequence-phase2-confirm.puml
```

Or just ignore them - doesn't matter for the report.

---

## ✅ FINAL FILE COUNT

**Total UML files:** 13
**Recommended for report:** 8
**Redundant/Outdated:** 3
**Alternative (optional):** 2

**You have MORE than enough diagrams!** Quality over quantity. 🎉

---

## 📝 CAPTION TEMPLATE

For each diagram in your report, add a caption like this:

**Figure X: [Diagram Type] - [Title]**
"This diagram shows [what it depicts]. [Key insight or pattern shown]. [How it addresses requirements]."

Example:
**Figure 2: Class Diagram - Complete System Architecture**
"This diagram illustrates the complete class structure of GoHaul using MVC architecture. The Singleton pattern ensures a single database connection, Strategy pattern enables multiple payment providers, and the Repository pattern abstracts data access. The BookingRequest model implements our two-phase booking system to prevent double-booking race conditions."

---

**Your diagrams are accurate and ready for the report!** ✅
