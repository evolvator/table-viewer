# table viewer

Based on [React Table](https://react-table.js.org), shows json table with sort, filter, page and columns control stored in url path.

[Example link](https://evolvator.github.io/table-viewer/#/{"path"%3A"https%3A%2F%2Fdata.nasa.gov%2Fresource%2F2vr3-k9wn.json"%2C"columns"%3A[{"id"%3A"designation"}%2C{"id"%3A"discovery_date"%2C"disabled"%3Atrue}%2C{"id"%3A"h_mag"}%2C{"id"%3A"i_deg"}%2C{"id"%3A"moid_au"%2C"disabled"%3Atrue}%2C{"id"%3A"orbit_class"}%2C{"id"%3A"period_yr"}%2C{"id"%3A"pha"}%2C{"id"%3A"q_au_1"}%2C{"id"%3A"q_au_2"}]%2C"filtered"%3A[{"id"%3A"orbit_class"%2C"list"%3A[]%2C"type"%3A0%2C"regexp"%3A"Apollo|Amor|Aten"}%2C{"id"%3A"pha"%2C"list"%3A["Y"]%2C"type"%3A0%2C"regexp"%3A""}]%2C"sorted"%3A[{"id"%3A"period_yr"%2C"desc"%3Afalse}%2C{"id"%3A"q_au_1"%2C"desc"%3Atrue}]%2C"page"%3A0%2C"pageSize"%3A20})

> Yes, you can sort and filter it, and then send your friends :)

Supported url storaged features:

- json file format
- multi sorting
- sorting order
- select filtering
- regexp filtering
- numeric and alphabetical columns sorting
- background progress bars in numeric columns
- columns visibility

Minuses:

- only **https**
- all json must be **array** with **plain objects**

### Plans

We want to add support for other formats and additional configurations, but now we do not need it. We will add these features if you write an issue about what you need.
