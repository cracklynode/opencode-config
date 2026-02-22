### {{rule_name}}

**Type**: {{validation_type}}
**Field**: {{field_name}}
**Error Message**: {{error_message}}

{% if pattern %}
**Pattern**: `{{pattern}}`
{% endif %}

{% if min_max %}
**Range**: {{min}} - {{max}}
{% endif %}

{% if enum_values %}
**Allowed Values**: {{allowed_values}}
{% endif %}

