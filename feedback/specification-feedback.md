Project Specification Feedback
==================

Commit graded: d1baa183d7ac861fed437f4bb1e73c1b29164cf7

### The product backlog (10/10)

Your backlog is pretty detailed, but can be improved:
* A spreadsheet-like format is easier to read for backlogs, rather than bulleted lists. You can also explore existing online tools for generating and tracking work on a project. 
* You should have a clear assignment of responsibility for each feature, to the team member(s) who will complete that feature. Each student should have sole responsibility for some features on the overall project. An easy way to organize this is to have a column in your spreadsheet recording the responsible team member.
* You should do a cost estimate for each feature, in hours. If the cost estimate is more than 5 or 8 hours, consider breaking the feature into smaller work units to improve your ability to track progress on it.

### Data models (9/10)

* Instead of using a ForeignKey to the Django authentication `User` model, you should use a OneToOneField in the `Person` model as the relationship from `User` to the profile information is a one-to-one relationship.
* Your recipe is missing a photo field.
* Consider adding tastiness and difficulty fields in the recipe model.
* You shouldn't only use CharField for location. Consider adding two fields, latitude and longitude.
* You're missing a field for users to save favorite recipes.
* Missing a model for notifications.
* Consider separating your `Ingredient` model into Ingredient (the igredient itself, with name and unit price) and RecipeIngredient.

### Wireframes or mock-ups (9/10)

Nice wireframes! It seems like you're missing the wireframes for asking nearby friends to cook together/provide ingredients though.

### Additional Information

You've got a lot of features lined up in your backlog. Prioritize the more substantial features and the more interesting features. I personally think that finding nearby friends to cook together and your stretch goal Amazon pricing are quite interesting.

---
#### Total score (28/30)
---
Graded by: Kelly Cheng (kuangchc@andrew.cmu.edu)

To view this file with formatting, visit the following page: https://github.com/CMU-Web-Application-Development/Team213/blob/master/feedback/specification-feedback.md