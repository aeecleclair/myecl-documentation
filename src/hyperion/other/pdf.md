---
title: PDF
order: 18
category:
  - Guide
---

# PDF Guide

## Introduction

Wikipedia's definition:

> Portable Document Format (PDF), standardized as ISO 32000, is a file format developed by Adobe in 1993 used to present documents, including text formatting and images, in a manner independent of application software, hardware, and operating systems. Based on the PostScript language, each PDF file encapsulates a complete description of a fixed-layout document, including the text, fonts, vector graphics, raster images and other information needed to display it.

One of the most common use cases of PDF in web applications is to generate PDF files from HTML templates. This is what we do in Hyperion, for example to generate the invoices for the users in MyECLPay.

For that purpose, we use in combination jinja2 templates and weasyprint library to generate PDF files from HTML templates.

::: warning WeasyPrint

WeasyPrint is not required to run Hyperion unless you want to generate PDF files from HTML templates. So if you would like to use PDF generation features, you need to make sure that WeasyPrint is installed and properly configured in your environment.

TODO: step to install and configure WeasyPrint

:::

## Creating a PDF template

We will use the invoice as an example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <!--<link href="./output.css" rel="stylesheet" />-->

    <style>
      @font-face {
        font-family: "DejaVu Sans";
        src: url("fonts/DejaVuSans.ttf") format("truetype");
      }

      body {
        font-family: "DejaVu Sans", sans-serif;
      }

      @page {
        @bottom-center {
          content: "Facture : {{invoice.reference}} — Cette facture a été générée par {{ payment_name }}";
          font-size: 10px;
          color: #666;
        }

        margin: 2cm;
      }
    </style>
  </head>
  <body class="text-gray-800 text-sm font-sans">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{invoice.structure.name}}
        </h1>
        <p>
          {{invoice.structure.siege_address_street}}<br />
          {{invoice.structure.siege_address_zipcode}}
          {{invoice.structure.siege_address_city}}<br />
          {{invoice.structure.siege_address_country}}<br />
          {% if invoice.structure.siret %} SIRET :
          {{invoice.structure.siret}}<br />
          {% endif %}
        </p>
      </div>
      <div class="text-right">
        <p class="text-sm"><strong>Facture : </strong>{{invoice.reference}}</p>
        <p>
          <strong>{{invoice.structure.siege_address_city}}, le </strong>
          {{invoice.creation.strftime("%d/%m/%Y")}}
        </p>
      </div>
    </header>

    <section class="mb-8">
      <h2 class="font-semibold text-lg mb-2">Adressée à :</h2>
      <p>
        {{holder_coordinates.name}}<br />
        {{holder_coordinates.address_street}}<br />
        {{holder_coordinates.address_zipcode}}
        {{holder_coordinates.address_city}}<br />
        {{holder_coordinates.address_country}}<br />
        {% if holder_coordinates.siret %} SIRET: {{holder_coordinates.siret}}<br />
        {% endif %}
      </p>
    </section>

    <table class="w-full border-collapse mb-8">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="border p-2">Description</th>
          <th class="border p-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border p-2">
            Solde {{payment_name}} du
            {{invoice.start_date.strftime("%d/%m/%Y")}} au
            {{invoice.end_date.strftime("%d/%m/%Y")}}
          </td>
          <td class="border p-2 text-right">{{invoice.total/100}} €</td>
        </tr>
      </tbody>
    </table>

    <section class="mb-8 flex justify-end">
      <table class="text-right">
        <tr>
          <td class="p-2 text-lg font-bold">Total :</td>
          <td class="p-2 text-lg font-bold">{{invoice.total/100}} €</td>
        </tr>
      </table>
    </section>

    <section class="mb-8 italic text-sm text-gray-600">
      Association à but non lucratif, non assujettie à la TVA (article 261 du
      CGI)
    </section>

    <section class="mb-8">
      <p class="font-semibold mb-2">Par virement :</p>
      <table>
        <tr>
          <td>IBAN :</td>
          <td>{{invoice.structure.iban}}</td>
        </tr>
        <tr>
          <td>BIC :</td>
          <td>{{invoice.structure.bic}}</td>
        </tr>
      </table>
    </section>

    <section class="mb-8">
      <p class="font-semibold mb-2">Délai de paiement : 30 jours</p>
      <p>
        En cas de retard de paiement, seront exigibles, conformément à l'article
        L 441-6 du code de commerce, une indemnité calculée sur la base de trois
        fois le taux de l'intérêt légal en vigueur ainsi qu'une indemnité
        forfaitaire pour frais de recouvrement de 40 euros.
      </p>
    </section>

    <section style="page-break-before: always">
      <h2 class="text-xl font-bold mb-4">
        Détail de l'utilisation de {{ payment_name }}
      </h2>
      <p class="mb-4">Période du 10/01/2025 au 15/02/2025</p>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="border p-2">Magasin</th>
            <th class="border p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {% for detail in invoice.details %}
          <tr>
            <td class="border p-2">{{detail.store.name}}</td>
            <td class="border p-2 text-right">{{detail.total/100}}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </section>
  </body>
</html>
```

You can notice that you can use your variables in the template, e.g. `{{invoice.structure.name}}` will be replaced by the name of the structure in the invoice object that you will pass to the template when rendering it.
Notice also a for loop :
```html
{% for detail in invoice.details %}
  <tr>
    <td class="border p-2">{{detail.store.name}}</td>
    <td class="border p-2 text-right">{{detail.total/100}}</td>
  </tr>
{% endfor %}
```

## Generating a PDF from a template

Here is how:

```py
context = {
    "invoice": invoice_db.model_dump(),
    "payment_name": settings.school.payment_name,
    "holder_coordinates": {
        "name": bank_holder_structure.name,
        "address_street": bank_holder_structure.siege_address_street,
        "address_city": bank_holder_structure.siege_address_city,
        "address_zipcode": bank_holder_structure.siege_address_zipcode,
        "address_country": bank_holder_structure.siege_address_country,
        "siret": bank_holder_structure.siret,
    },
}
await generate_pdf_from_template(
    template_name="mypayment_invoice.html", # The template name, omit the assets/templates/ part.
    directory="mypayment/invoices", # The directory where the generated PDF will be stored, will be saved in data/
    filename=invoice.id,
    context=context,
)
```

If you want, you can have a look at the `generate_pdf_from_template` function to see how it works. (Especially to see how css is imported (Tailwind in our case)).

::: details generate_pdf_from_template function

```py
async def generate_pdf_from_template(
    template_name: str,
    context: dict[str, Any],
    directory: str,
    filename: str | UUID,
) -> None:
    """
    Generate a PDF file from a Jinja2 template using weasyprint.
    `context` is a dictionary containing the variables to be used in the template.

    Save it in the `data` folder. `filename` should be a uuid.

    The template should be located in the `assets/templates` directory.

    You should only provide thrusted templates to this function.
    See [WeasyPrint security consideration](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#security)
    """
    from weasyprint import CSS, HTML

    templates = Environment(
        loader=FileSystemLoader("assets/templates"),
        autoescape=select_autoescape(["html"]),
    )
    rendered_html = templates.get_template(template_name).render(context)

    html = HTML(string=rendered_html)
    css = CSS("assets/templates/output.css")

    pdf = html.write_pdf(
        stylesheets=[css],
    )

    await save_bytes_as_data(
        file_bytes=pdf,
        directory=directory,
        filename=filename,
        extension="pdf",
    )
```

:::