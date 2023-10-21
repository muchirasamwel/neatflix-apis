class APIFeatures {
  constructor (query, queryParams, Model) {
    this.query = query
    this.queryParams = queryParams
    this.Model = Model
    this.pages = null
    this.newQuery = {}
  }

  filter () {
    const reqQuery = { ...this.queryParams }
    const reserves = ['limit', 'page', 'sort', 'fields']
    reserves.forEach(reserve => {
      delete reqQuery[reserve]
    })

    // convert query to correct mongo syntax
    // eg {year:{lt:2020}} to  {year:{$lt:2020}}
    const newQuery = JSON.parse(
      JSON.stringify(reqQuery).replace(
        /\b(lt|lte|gt|gte)\b/g,
        match => '$' + match
      )
    )
    this.newQuery = newQuery
    this.query = this.query.find(newQuery)

    return this
  }

  sort () {
    if (this.queryParams.sort)
      this.query = this.query.sort(this.queryParams.sort.replace(/,/g, ' '))
    else this.query = this.query.sort('-createdAt')

    return this
  }

  limitFields () {
    if (this.queryParams.fields)
      this.query = this.query.select(this.queryParams.fields.replace(/,/g, ' '))
    else this.query = this.query.select('-__v')

    return this
  }

  async paginate () {
    const allCount = await this.Model.countDocuments(this.newQuery)
    const page = this.queryParams.page * 1 || 1
    const limit = this.queryParams.limit * 1 || 10
    const skip = (page - 1) * limit
    this.pages = Math.ceil(allCount / limit)

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
