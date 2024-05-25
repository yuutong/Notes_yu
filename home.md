# My Open Publishing Space

## Create, Share and Collaborate

![Photo of Mountain](images/mountain.jpg)

[Docsify](https://docsify.js.org/#/) can generate article, portfolio and documentation websites on the fly. Unlike Docusaurus, Hugo and many other Static Site Generators (SSG), it does not generate static html files. Instead, it smartly loads and parses your Markdown content files and displays them as a website.

## Introduction

**Markdown** is a system-independent markup language that is easier to learn and use than **HTML**.

![The Markdown Mark](images/markdown-red.png)  
_Figure 1: The Markdown Mark_

Some of the key benefits are:

1. Markdown is simple to learn, with minimal extra characters, so it's also quicker to write content.
2. Less chance of errors when writing in markdown.
3. Produces valid XHTML output.
4. Keeps the content and the visual display separate, so you cannot mess up the look of your site.
5. Write in any text editor or Markdown application you like.
6. Markdown is a joy to use!

John Gruber, the author of Markdown, puts it like this:

> The overriding design goal for Markdown’s formatting syntax is to make it as readable as possible. The idea is that a Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions. While Markdown’s syntax has been influenced by several existing text-to-HTML filters, the single biggest source of inspiration for Markdown’s syntax is the format of plain text email.
> -- <cite>John Gruber</cite>


Without further delay, let us go over the main elements of Markdown and what the resulting HTML looks like:

### Headings

Headings from `h1` through `h6` are constructed with a `#` for each level:

```markdown
# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
```

Renders to:

<h1> h1 Heading </h1>
<h2>  h2 Heading </h2>
<h3>  h3 Heading </h3>
<h4>  h4 Heading </h4>
<h5>  h5 Heading </h5>
<h6>  h6 Heading </h6>

HTML:

```html
<h1>h1 Heading</h1>
<h2>h2 Heading</h2>
<h3>h3 Heading</h3>
<h4>h4 Heading</h4>
<h5>h5 Heading</h5>
<h6>h6 Heading</h6>
```
