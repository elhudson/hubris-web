const filter_template=(table, filter, sort, group)=>{
    return([table, {
            filter:filter,
            sort:sort,
            group:group
        }]
    )
}

const filters=[]
const sort='xp'
const filter={'tier':1}

filters.push(filter_template('class_features', filter, sort, 'class_paths'))
filters.push(filter_template('classes', {}, 'name', '""' ))
filters.push(filter_template('backgrounds', {}, 'name', 'setting' ))
filters.push(filter_template('tag_features', filter, sort, 'tags'))
filters.push(filter_template('effects', filter, sort, 'tree'))
filters.push(filter_template('ranges', filter, sort, 'tree'))
filters.push(filter_template('durations', filter, sort, 'tree'))

export const fs=Object.fromEntries(filters)

