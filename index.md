---
layout: default
title: "Home"
icon: 🧭
body_class: home-split
---

<div class="home-split__wrap">
	<div class="home-split__left">
		<div class="home-split__intro">
			<div class="page-icon" aria-label="Compass" title="Compass">🧭</div>
			<h1>Hi, I'm Marina</h1>
			<p class="lead">I'm a junior at <a href="https://www.minerva.edu/" target="_blank" rel="noopener">Minerva University</a> studying Computer Science and Math.</p>
            <p class="lead"> Over time, my interests have spanned from AI hackathons to mathematical modelling and ML research. Nowadays, I like to work on projects based on theory; at the intersection of equations and computation. Here are some things I've worked on. </p>
            <p class="lead">(I'm also an avid Notion user which is what inspired the look of this page.)</p>
			<ul class="home-links">
                <li><a href="/assets/docs/alignment-course-final-project-gema-parreno.pdf" target="_blank" rel="noopener">CV</a></li>
                <li><a href="https://www.linkedin.com/in/marina-levay/" target="_blank" rel="noopener">LinkedIn</a></li>
            </ul>
		</div>
	</div>
	<div class="home-split__right">
		<ul class="gallery-grid">
		{% assign gallery = site.projects | sort: 'year' | reverse %}
		{% for p in gallery %}
	<li class="gallery-card" {% if p.github %}data-github="{{ p.github }}"{% endif %} {% if p.demo_url %}data-demo="{{ p.demo_url }}"{% endif %} data-page="{{ p.url | relative_url }}">
		<a href="{{ p.github | default: p.url | relative_url }}" class="gallery-link" target="_blank" rel="noopener">
			<div class="cover"
			  style="
			    {% if p.gradient %}background: {{ p.gradient }}{% if p.hero %}, url('{{ p.hero | relative_url }}'){% endif %};{% elsif p.hero %}background: linear-gradient(135deg, #20265dff, #1c88f3ff), url('{{ p.hero | relative_url }}');{% endif %}
			    background-size: cover;
			    background-position: center;
			    background-repeat: no-repeat;">
			</div>
			<div class="meta">
				<h2>{{ p.title }}</h2>
				<p class="summary">{{ p.summary | default: p.content | strip_html | strip_newlines | truncate: 160 }}</p>
				{% if p.tags %}<div class="tags">{% for t in p.tags %}<span class="tag">{{ t }}</span>{% endfor %}</div>{% endif %}
			</div>
		</a>
	</li>
		{% endfor %}
		</ul>
	</div>
</div>
