# Knowledge Base — Chatbot

> **Version:** 1.0.0  
> **Last Updated:** 2026-04-27  

This folder contains markdown files that the AI chatbot uses to answer customer questions. Add new `.md` files here to expand the chatbot's knowledge.

---

## 📁 File Structure

```
knowledge-base/
├── _index.md          # This file
├── 01-company.md      # Company information
├── 02-products.md    # Product information
├── 03-ingredients.md # Ingredient details
├── 04-shipping.md    # Shipping policies
├── 05-returns.md     # Return policies
├── 06-wholesale.md   # B2B information
└── 07-contact.md    # Contact information
```

---

## 📝 Adding New Knowledge

1. Create a new `.md` file in this folder
2. Use the format below
3. The chatbot will automatically include it

### File Format

```markdown
---
title: Topic Title
category: shipping | products | company | ingredients | returns | wholesale | contact
priority: high | medium | low
---

# Topic Title

Brief introduction.

## FAQ

### Question 1?
Answer 1.

### Question 2?
Answer 2.

## Keywords
shipping, delivery, tracking, courier
```

---

## 🔧 Chatbot Configuration

The chatbot uses:
- **Model:** HuggingFace inference API (free tier)
- **Fallback:** Rule-based FAQ matching
- **Context:** All `.md` files in this folder

### Environment Variables

```env
VITE_HUGGINGFACE_API_KEY=hf_...
VITE_HUGGINGFACE_MODEL=bigscience/bloom-560m
```

---

*Add markdown files to expand chatbot knowledge.*