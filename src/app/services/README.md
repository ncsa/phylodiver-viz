# External Annotation Databases

The visualization tool attempts to automatically add supplementary annotations for specific information it is provided.

## Variant Consequences

The `SNV[*].consequence` property of the visualization tool's JSON upload file schema is checked for a matching key from the [Sequence Ontology](http://www.sequenceontology.org/). If there is an exact string match to a `SO term` term defined the Ensembl Variant Effect Predictor [help page](https://useast.ensembl.org/info/genome/variation/prediction/predicted_data.html), then the corresponding variant `IMPACT` category label is also added to the SNV. If there is no match on `SNV[*]consequence`, the SNV is given the variant `IMPACT` category of `Unknown`. This variant `IMPACT` category is reported in the details table and used for grouping SNVs in the mutation cluster edge summaries.

```McLaren, et al. The Ensembl Variant Effect Predictor. Genome Biology, 2016.``` [[link](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-016-0974-4)]

## Cancer Gene Census

The `SNV[*].gene` property of the visualization tool's JSON upload file schema is checked for a matching key from the [Cancer Gene Census](https://cancer.sanger.ac.uk/census) (downloaded May 28, 2022). If there is an exact string match to a `Gene Symbol` in the table download, then the gene `Tier` is recorded for the particular SNV. The interface reports this `Tier` in the details table and counts the unique `Tier 1` genes to summarize all SNVs of a specific variant consequence  `IMPACT`category.

```Sondka, et al. "The COSMIC Cancer Gene Census: describing genetic dysfunction across all human cancers." Nature Reviews Cancer, 2018.``` [[link](https://www.nature.com/articles/s41568-018-0060-1)]

## Drug-Gene Interactions

The `SNV[*].gene` property of the visualization tool's JSON upload file schema is also checked for a matching key from the [Drug Interaction Database](https://www.dgidb.org/downloads) (downloaded Feb 2022 release). If there is an exact string match to a `gene_name` in the table download, then the unique number of corresponding `drug_claim_primary_name` drugs are counted for that gene. The interface reports this count of interacting molecules in the the details table, showing the drug interactor if there is just one. For summarization purposes, the interface counts the number of unique genes with any interactor for all SNVs of a specific variant consequence `IMPACT` category.

```Cotto, et al. "DGIdb 3.0: a redesign and expansion of the drug–gene interaction database." Nucleic acids research, 2018.``` [[link](https://academic.oup.com/nar/article/46/D1/D1068/4634012?login=true)]
