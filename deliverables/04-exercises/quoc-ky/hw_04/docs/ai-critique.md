# AI Critique (200–300 words) – HW04 Automation Testing

**Student:** Nguyen Quoc Ky | **Student ID:** 23120138 | **Class:** 23CLC02  
**Feature Scope:** FR-02 (Login & Lockout), FR-07 (Shopping Cart), FR-17 (Admin Coupon Management)

---

Throughout this assignment, collaborating with AI provided a fast initial boilerplate but clearly exposed critical boundaries in contextual comprehension and runtime behavior. Specifically, the AI drafted scripts with several glaring oversights: it used a single shared credential for all authentication tests, resulting in cascading false failures when negative tests triggered the 180-second account lockout; it relied on fragile Tailwind CSS selectors rather than accessible semantic roles; and it completely omitted teardown hooks for coupon creation, violating the database UNIQUE constraint on consecutive runs. Furthermore, the AI erroneously assumed that cart state was persisted across page reloads, failing to recognize that the SUT manages cart data entirely within volatile React state.

The primary reason for these failures is that generative language models synthesize code based on generic statistical patterns learned from vast repositories rather than dynamic execution analysis. The AI cannot natively inspect the internal runtime lifecycle, server-side SQLite schema constraints, or specific React state trees unless explicitly guided. It assumes ideal environmental defaults that rarely match real-world, buggy software systems.

This experience reinforced a fundamental engineering principle: AI must be treated as a disciplined junior assistant, never as an unverified oracle. High-value test automation relies not on boilerplate volume, but on data isolation, deterministic state management, and resilient assertions. Effective collaboration requires the human engineer to maintain ownership over the architecture, actively review every generated line against the System Requirements Specification, and enforce rigorous quality gates.
