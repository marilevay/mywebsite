---
layout: default
title: Projects
permalink: /projects/
---

# Projects

A growing collection of things I've built or contributed to.

<ul class="project-grid">
{% assign items = site.projects | sort: 'year' | reverse %}
{% for p in items %}
  <li class="project-card">
    <a href="{{ p.url | relative_url }}">
      <h2>{{ p.title }}</h2>
      <p class="summary">{{ p.summary }}</p>
      {% if p.tags %}<div class="tags">{% for t in p.tags %}<span class="tag">{{ t }}</span>{% endfor %}</div>{% endif %}
      <div class="meta"><span>{{ p.year }}</span>{% if p.status %} · <span class="status status-{{ p.status }}">{{ p.status }}</span>{% endif %}</div>
    </a>
  </li>
{% endfor %}
</ul>
