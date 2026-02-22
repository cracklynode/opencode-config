### Step {{step_number}}: {{step_title}}

{{step_description}}

{% if conditional %}
**Condition**: {{condition_description}}
{% endif %}

**Prompts for**: {{placeholders}}

{% if validation %}
**Validation**: {{validation_rule}}
{% endif %}

{% if offer_suggestion %}
**Offer suggestion**: Yes - suggest draft for user review
{% endif %}

