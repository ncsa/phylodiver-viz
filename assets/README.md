# Demo Datasets

This visualization tool comes with demo datasets in order to enable users to explore the capabilities of the system without producing their own data files.

The demo datasets were downloaded as VCF files and prepared for visualization by running the [PhyloFlow workflow](https://github.com/ncsa/phyloflow) separately on each.  

The demo datasets that are pre-configured to be loaded into the visualization interface are:

1. **Griffith_et_al_AML**: an ultra-deep (300x-400x) bulk sequencing dataset containing the somatic mutations of a primary acute myeloid leukemia (AML) and its subsequent relapse at 16 months. [[link](https://www.cell.com/fulltext/S2405-4712(15)00113-1)]

    ```M. Griffith, et al. "Optimizing cancer genome sequencing and analysis." Cell systems. 2015```

2. **inhouse_colorectal_cancer**: a 40x bulk sequencing dataset containing the somatic mutations of a cecum and appendix sample from patient 045 of an in-house Mayo Clinic colorectal cancer (CRC) study.

We also provide a smaller example JSON file for users to better explore the custom JSON format schema required for uploading their own data into the visualization tool:

1. **A25.mutect2.filtered.snp**: a deep (74x) bulk sequencing dataset containing the somatic mutations of a primary hepatocellular carcinoma (HCC) [[link](https://www.pnas.org/doi/10.1073/pnas.1519556112)]. This data has been filtered to a subset of consequential SNPs.

    ```Ling, et al. "Extremely high genetic diversity in a single tumor points to prevalence of non- darwinian cell evolution." Proceedings of the National Academy of Sciences, 2015.```
