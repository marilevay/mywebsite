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
			<p class="lead"> I like to solve problems in deep learning with the independent questioning of a scientist, but with the building speed of an engineer.</p>
            <p class="lead"> Over time, my interests have grown from UX/UI design in hackathon projects to AI safety, mathematical modelling and geometry processing research. Here's what I've worked on so far. </p>
			<p class="lead"> Fun facts: I lived in 3 different countries in undergrad. My songs change from classical to pop punk rock in the same playlist. I also can't eat bread (I've been celiac my whole life).</p>
            <p class="lead">I'm also an avid Notion user, which is what inspired the look of this page. Have fun roaming around here!</p>
			<ul class="home-links">
				<li><a href="https://docs.google.com/document/d/1lXqNM37VCeORvkck0FZrz6SlomD-1gXc39HEdP-Rp2o/view?usp=sharing" target="_blank" rel="noopener">CV</a></li>
				<li><a href="https://github.com/marilevay" target="_blank" rel="noopener">GitHub</a></li>
				<li><a href="https://www.linkedin.com/in/marina-levay/" target="_blank" rel="noopener">LinkedIn</a></li>
				<li><a href="#" class="art-design-btn home-links-toggle" data-filter="art">Art/Design</a></li>
			</ul>
		</div>
	</div>
	<div class="home-split__right">
		<ul class="gallery-grid">
		{% assign gallery = site.projects | sort: 'year' | reverse %}
		{% for p in gallery %}
	{% assign is_art = false %}
	{% if p.tags contains 'art' or p.tags contains 'design' %}
	  {% assign is_art = true %}
	{% endif %}
	<li class="gallery-card" data-type="{% if is_art %}art{% else %}coding{% endif %}" {% if p.github %}data-github="{{ p.github }}"{% endif %} {% if p.demo_url %}data-demo="{{ p.demo_url }}"{% endif %} data-page="{{ p.url | relative_url }}">
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
				{% if p.tags %}
					<div class="tags">
						{% if p.year %}
							<span class="tag-year">{{ p.year }}</span>
						{% else %}
							<span class="tag-year">{{ p.date | date: "%Y" }}</span>
						{% endif %}
						{% for t in p.tags %}{% unless t == 'coding' or t == 'art' %}<span class="tag">{{ t }}</span>{% endunless %}{% endfor %}
					</div>
				{% endif %}
				{% if p.tags contains 'coding' %}<span class="tag" style="display:none">coding</span>{% endif %}
				{% if p.tags contains 'art' %}<span class="tag" style="display:none">art</span>{% endif %}
			</div>
		</a>
	</li>
		{% endfor %}
		</ul>
	</div>
</div>
