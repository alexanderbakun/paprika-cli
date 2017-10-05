var _rules = [];

function rules()
{
    return _rules.slice();
}

rules.create = function(value)
{
    var _value = value,
        _type = (typeof value),
        _index = _rules.length;
    
    _rules[_index] = value;
    
    rules[_index] = function(v)
    {
        if(v === undefined) return _value;
        _value = (typeof v === _type ? v : _value);
        _rules[_index] = (typeof v === _type ? v : _value);
        return _rules;
    }
    
    return rules;
}

module.exports = rules;