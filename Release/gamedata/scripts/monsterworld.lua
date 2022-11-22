
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        ____moduleCache[file] = { value = (select("#", ...) > 0) and module(...) or module(file) }
        return ____moduleCache[file].value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function(...) 
local function __TS__ArrayIsArray(value)
    return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end

local function __TS__ArrayConcat(self, ...)
    local items = {...}
    local result = {}
    local len = 0
    for i = 1, #self do
        len = len + 1
        result[len] = self[i]
    end
    for i = 1, #items do
        local item = items[i]
        if __TS__ArrayIsArray(item) then
            for j = 1, #item do
                len = len + 1
                result[len] = item[j]
            end
        else
            len = len + 1
            result[len] = item
        end
    end
    return result
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__ArrayEntries(array)
    local key = 0
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = array[key + 1] == nil, value = {key, array[key + 1]}}
            key = key + 1
            return result
        end
    }
end

local function __TS__ArrayEvery(self, callbackfn, thisArg)
    for i = 1, #self do
        if not callbackfn(thisArg, self[i], i - 1, self) then
            return false
        end
    end
    return true
end

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

local function __TS__ArrayFind(self, predicate, thisArg)
    for i = 1, #self do
        local elem = self[i]
        if predicate(thisArg, elem, i - 1, self) then
            return elem
        end
    end
    return nil
end

local function __TS__ArrayFindIndex(self, callbackFn, thisArg)
    for i = 1, #self do
        if callbackFn(thisArg, self[i], i - 1, self) then
            return i - 1
        end
    end
    return -1
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local __TS__ArrayFrom
do
    local function arrayLikeStep(self, index)
        index = index + 1
        if index > self.length then
            return
        end
        return index, self[index]
    end
    local function arrayLikeIterator(arr)
        if type(arr.length) == "number" then
            return arrayLikeStep, arr, 0
        end
        return __TS__Iterator(arr)
    end
    function __TS__ArrayFrom(arrayLike, mapFn, thisArg)
        local result = {}
        if mapFn == nil then
            for ____, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = v
            end
        else
            for i, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = mapFn(thisArg, v, i - 1)
            end
        end
        return result
    end
end

local function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k + 1, len do
        if self[i] == searchElement then
            return true
        end
    end
    return false
end

local function __TS__ArrayIndexOf(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    if len == 0 then
        return -1
    end
    if fromIndex >= len then
        return -1
    end
    if fromIndex < 0 then
        fromIndex = len + fromIndex
        if fromIndex < 0 then
            fromIndex = 0
        end
    end
    for i = fromIndex + 1, len do
        if self[i] == searchElement then
            return i - 1
        end
    end
    return -1
end

local function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local parts = {}
    for i = 1, #self do
        parts[i] = tostring(self[i])
    end
    return table.concat(parts, separator)
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayPush(self, ...)
    local items = {...}
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__ArrayReduce(self, callbackFn, ...)
    local len = #self
    local k = 0
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, len do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReduceRight(self, callbackFn, ...)
    local len = #self
    local k = len - 1
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, 1, -1 do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReverse(self)
    local i = 1
    local j = #self
    while i < j do
        local temp = self[j]
        self[j] = self[i]
        self[i] = temp
        i = i + 1
        j = j - 1
    end
    return self
end

local function __TS__ArrayUnshift(self, ...)
    local items = {...}
    local numItemsToInsert = #items
    if numItemsToInsert == 0 then
        return #self
    end
    for i = #self, 1, -1 do
        self[i + numItemsToInsert] = self[i]
    end
    for i = 1, numItemsToInsert do
        self[i] = items[i]
    end
    return #self
end

local function __TS__ArraySort(self, compareFn)
    if compareFn ~= nil then
        table.sort(
            self,
            function(a, b) return compareFn(nil, a, b) < 0 end
        )
    else
        table.sort(self)
    end
    return self
end

local function __TS__ArraySlice(self, first, last)
    local len = #self
    local ____first_0 = first
    if ____first_0 == nil then
        ____first_0 = 0
    end
    first = ____first_0
    if first < 0 then
        first = len + first
        if first < 0 then
            first = 0
        end
    else
        if first > len then
            first = len
        end
    end
    local ____last_1 = last
    if ____last_1 == nil then
        ____last_1 = len
    end
    last = ____last_1
    if last < 0 then
        last = len + last
        if last < 0 then
            last = 0
        end
    else
        if last > len then
            last = len
        end
    end
    local out = {}
    first = first + 1
    last = last + 1
    local n = 1
    while first < last do
        out[n] = self[first]
        first = first + 1
        n = n + 1
    end
    return out
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
end

local function __TS__ArraySplice(self, ...)
    local args = {...}
    local len = #self
    local actualArgumentCount = __TS__CountVarargs(...)
    local start = args[1]
    local deleteCount = args[2]
    if start < 0 then
        start = len + start
        if start < 0 then
            start = 0
        end
    elseif start > len then
        start = len
    end
    local itemCount = actualArgumentCount - 2
    if itemCount < 0 then
        itemCount = 0
    end
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - start
    else
        local ____deleteCount_0 = deleteCount
        if ____deleteCount_0 == nil then
            ____deleteCount_0 = 0
        end
        actualDeleteCount = ____deleteCount_0
        if actualDeleteCount < 0 then
            actualDeleteCount = 0
        end
        if actualDeleteCount > len - start then
            actualDeleteCount = len - start
        end
    end
    local out = {}
    for k = 1, actualDeleteCount do
        local from = start + k
        if self[from] ~= nil then
            out[k] = self[from]
        end
    end
    if itemCount < actualDeleteCount then
        for k = start + 1, len - actualDeleteCount do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
        for k = len - actualDeleteCount + itemCount + 1, len do
            self[k] = nil
        end
    elseif itemCount > actualDeleteCount then
        for k = len - actualDeleteCount, start + 1, -1 do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
    end
    local j = start + 1
    for i = 3, actualArgumentCount do
        self[j] = args[i]
        j = j + 1
    end
    for k = #self, len - actualDeleteCount + itemCount + 1, -1 do
        self[k] = nil
    end
    return out
end

local function __TS__ArrayToObject(self)
    local object = {}
    for i = 1, #self do
        object[i - 1] = self[i]
    end
    return object
end

local function __TS__ArrayFlat(self, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = self[i]
        if depth > 0 and __TS__ArrayIsArray(value) then
            local toAdd
            if depth == 1 then
                toAdd = value
            else
                toAdd = __TS__ArrayFlat(value, depth - 1)
            end
            for j = 1, #toAdd do
                local val = toAdd[j]
                len = len + 1
                result[len] = val
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArrayFlatMap(self, callback, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = callback(thisArg, self[i], i - 1, self)
        if __TS__ArrayIsArray(value) then
            for j = 1, #value do
                len = len + 1
                result[len] = value[j]
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArraySetLength(self, length)
    if length < 0 or length ~= length or length == math.huge or math.floor(length) ~= length then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    for i = length + 1, #self do
        self[i] = nil
    end
    return length
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Unpack = table.unpack or unpack

local function __TS__FunctionBind(fn, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        __TS__ArrayUnshift(
            args,
            __TS__Unpack(boundArgs)
        )
        return fn(__TS__Unpack(args))
    end
end

local __TS__Promise
do
    local function promiseDeferred(self)
        local resolve
        local reject
        local promise = __TS__New(
            __TS__Promise,
            function(____, res, rej)
                resolve = res
                reject = rej
            end
        )
        return {promise = promise, resolve = resolve, reject = reject}
    end
    local function isPromiseLike(self, thing)
        return __TS__InstanceOf(thing, __TS__Promise)
    end
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        self.finallyCallbacks = {}
        do
            local function ____catch(e)
                self:reject(e)
            end
            local ____try, ____hasReturned = pcall(function()
                executor(
                    nil,
                    __TS__FunctionBind(self.resolve, self),
                    __TS__FunctionBind(self.reject, self)
                )
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
    function __TS__Promise.resolve(data)
        local promise = __TS__New(
            __TS__Promise,
            function()
            end
        )
        promise.state = 1
        promise.value = data
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(
            __TS__Promise,
            function()
            end
        )
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local ____promiseDeferred_result_0 = promiseDeferred(nil)
        local promise = ____promiseDeferred_result_0.promise
        local resolve = ____promiseDeferred_result_0.resolve
        local reject = ____promiseDeferred_result_0.reject
        local isFulfilled = self.state == 1
        local isRejected = self.state == 2
        if onFulfilled then
            local internalCallback = self:createPromiseResolvingCallback(onFulfilled, resolve, reject)
            local ____self_fulfilledCallbacks_1 = self.fulfilledCallbacks
            ____self_fulfilledCallbacks_1[#____self_fulfilledCallbacks_1 + 1] = internalCallback
            if isFulfilled then
                internalCallback(nil, self.value)
            end
        else
            local ____self_fulfilledCallbacks_2 = self.fulfilledCallbacks
            ____self_fulfilledCallbacks_2[#____self_fulfilledCallbacks_2 + 1] = function(____, v) return resolve(nil, v) end
        end
        if onRejected then
            local internalCallback = self:createPromiseResolvingCallback(onRejected, resolve, reject)
            local ____self_rejectedCallbacks_3 = self.rejectedCallbacks
            ____self_rejectedCallbacks_3[#____self_rejectedCallbacks_3 + 1] = internalCallback
            if isRejected then
                internalCallback(nil, self.rejectionReason)
            end
        else
            local ____self_rejectedCallbacks_4 = self.rejectedCallbacks
            ____self_rejectedCallbacks_4[#____self_rejectedCallbacks_4 + 1] = function(____, err) return reject(nil, err) end
        end
        if isFulfilled then
            resolve(nil, self.value)
        end
        if isRejected then
            reject(nil, self.rejectionReason)
        end
        return promise
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if onFinally then
            local ____self_finallyCallbacks_5 = self.finallyCallbacks
            ____self_finallyCallbacks_5[#____self_finallyCallbacks_5 + 1] = onFinally
            if self.state ~= 0 then
                onFinally(nil)
            end
        end
        return self
    end
    function __TS__Promise.prototype.resolve(self, data)
        if __TS__InstanceOf(data, __TS__Promise) then
            data["then"](
                data,
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
            return
        end
        if self.state == 0 then
            self.state = 1
            self.value = data
            for ____, callback in ipairs(self.fulfilledCallbacks) do
                callback(nil, data)
            end
            for ____, callback in ipairs(self.finallyCallbacks) do
                callback(nil)
            end
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            for ____, callback in ipairs(self.rejectedCallbacks) do
                callback(nil, reason)
            end
            for ____, callback in ipairs(self.finallyCallbacks) do
                callback(nil)
            end
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            do
                local function ____catch(e)
                    reject(nil, e)
                end
                local ____try, ____hasReturned = pcall(function()
                    self:handleCallbackData(
                        f(nil, value),
                        resolve,
                        reject
                    )
                end)
                if not ____try then
                    ____catch(____hasReturned)
                end
            end
        end
    end
    function __TS__Promise.prototype.handleCallbackData(self, data, resolve, reject)
        if isPromiseLike(nil, data) then
            local nextpromise = data
            if nextpromise.state == 1 then
                resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                reject(nil, nextpromise.rejectionReason)
            else
                data["then"](data, resolve, reject)
            end
        else
            resolve(nil, data)
        end
    end
end

local function __TS__AsyncAwaiter(generator)
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            local adopt, fulfilled, step, resolved, asyncCoroutine
            function adopt(self, value)
                local ____temp_0
                if __TS__InstanceOf(value, __TS__Promise) then
                    ____temp_0 = value
                else
                    ____temp_0 = __TS__Promise.resolve(value)
                end
                return ____temp_0
            end
            function fulfilled(self, value)
                local success, resultOrError = coroutine.resume(asyncCoroutine, value)
                if success then
                    step(nil, resultOrError)
                else
                    reject(nil, resultOrError)
                end
            end
            function step(self, result)
                if resolved then
                    return
                end
                if coroutine.status(asyncCoroutine) == "dead" then
                    resolve(nil, result)
                else
                    local ____self_1 = adopt(nil, result)
                    ____self_1["then"](____self_1, fulfilled, reject)
                end
            end
            resolved = false
            asyncCoroutine = coroutine.create(generator)
            local success, resultOrError = coroutine.resume(
                asyncCoroutine,
                function(____, v)
                    resolved = true
                    local ____self_2 = adopt(nil, v)
                    ____self_2["then"](____self_2, resolve, reject)
                end
            )
            if success then
                step(nil, resultOrError)
            else
                reject(nil, resultOrError)
            end
        end
    )
end
local function __TS__Await(thing)
    return coroutine.yield(thing)
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

local __TS__SetDescriptor
do
    local function descriptorIndex(self, key)
        local value = rawget(self, key)
        if value ~= nil then
            return value
        end
        local metatable = getmetatable(self)
        while metatable do
            local rawResult = rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
    local function descriptorNewIndex(self, key, value)
        local metatable = getmetatable(self)
        while metatable do
            local descriptors = rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        local descriptor = __TS__CloneDescriptor(desc)
        metatable._descriptors[key] = descriptor
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(nil, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(nil, target, key, descriptor) or descriptor
                    local isSimpleValue = desc.configurable == true and desc.writable == true and not desc.get and not desc.set
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(nil, target, key, desc)
                else
                    result = decorator(nil, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(nil, target, key, paramIndex) end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0") or _VERSION == "Lua 5.1"
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (tostring(description) .. "\n") .. self.stack
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_2 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, self.constructor.new)
        local metatable = getmetatable(self)
        if not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        local ____temp_1
        if self.message ~= "" then
            ____temp_1 = (self.name .. ": ") .. self.message
        else
            ____temp_1 = self.name
        end
        return ____temp_1
    end
    Error = ____initErrorClass_2(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_4 = initErrorClass
        local ____class_3 = __TS__Class()
        ____class_3.name = ____class_3.name
        __TS__ClassExtends(____class_3, Error)
        function ____class_3.prototype.____constructor(self, ...)
            ____class_3.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_4(nil, ____class_3, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(__TS__StringAccess(iterable, index))
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

local __TS__Generator
do
    local function generatorIterator(self)
        return self
    end
    local function generatorNext(self, ...)
        local co = self.____coroutine
        if coroutine.status(co) == "dead" then
            return {done = true}
        end
        local status, value = coroutine.resume(co, ...)
        if not status then
            error(value, 0)
        end
        return {
            value = value,
            done = coroutine.status(co) == "dead"
        }
    end
    function __TS__Generator(fn)
        return function(...)
            local args = {...}
            local argsLength = __TS__CountVarargs(...)
            return {
                ____coroutine = coroutine.create(function() return fn(__TS__Unpack(args, 1, argsLength)) end),
                [Symbol.iterator] = generatorIterator,
                next = generatorNext
            }
        end
    end
end

local function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return valueType == "table" or valueType == "function"
end

local function __TS__LuaIteratorSpread(self, state, firstKey)
    local results = {}
    local key, value = self(state, firstKey)
    while key do
        results[#results + 1] = {key, value}
        key, value = self(state, key)
    end
    return __TS__Unpack(results)
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end

local __TS__Match = string.match

local __TS__MathAtan2 = math.atan2 or math.atan

local __TS__MathModf = math.modf

local function __TS__MathSign(val)
    if val > 0 then
        return 1
    elseif val < 0 then
        return -1
    end
    return 0
end

local function __TS__Modulo50(a, b)
    return a - math.floor(a / b) * b
end

local function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return value and 1 or 0
    else
        return 0 / 0
    end
end

local function __TS__NumberIsFinite(value)
    return type(value) == "number" and value == value and value ~= math.huge and value ~= -math.huge
end

local function __TS__NumberIsNaN(value)
    return value ~= value
end

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local ____temp_0
    if type(key) == "number" then
        ____temp_0 = key + 1
    else
        ____temp_0 = key
    end
    local luaKey = ____temp_0
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_5 = desc.set
        local ____desc_get_6 = desc.get
        local ____temp_1
        if desc.configurable ~= nil then
            ____temp_1 = desc.configurable
        else
            ____temp_1 = valueExists
        end
        local ____temp_2
        if desc.enumerable ~= nil then
            ____temp_2 = desc.enumerable
        else
            ____temp_2 = valueExists
        end
        local ____temp_3
        if desc.writable ~= nil then
            ____temp_3 = desc.writable
        else
            ____temp_3 = valueExists
        end
        local ____temp_4
        if desc.value ~= nil then
            ____temp_4 = desc.value
        else
            ____temp_4 = value
        end
        descriptor = {
            set = ____desc_set_5,
            get = ____desc_get_6,
            configurable = ____temp_1,
            enumerable = ____temp_2,
            writable = ____temp_3,
            value = ____temp_4
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

local function __TS__ObjectEntries(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = {key, obj[key]}
    end
    return result
end

local function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

local function __TS__ObjectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

local function __TS__ObjectValues(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = obj[key]
    end
    return result
end

local function __TS__ParseFloat(numberString)
    local infinityMatch = __TS__Match(numberString, "^%s*(-?Infinity)")
    if infinityMatch then
        local ____temp_0
        if __TS__StringAccess(infinityMatch, 0) == "-" then
            ____temp_0 = -math.huge
        else
            ____temp_0 = math.huge
        end
        return ____temp_0
    end
    local number = tonumber(__TS__Match(numberString, "^%s*(-?%d+%.?%d*)"))
    local ____number_1 = number
    if ____number_1 == nil then
        ____number_1 = 0 / 0
    end
    return ____number_1
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch then
                base = 16
                local ____TS__Match_result__0_0
                if __TS__Match(hexMatch, "-") then
                    ____TS__Match_result__0_0 = "-" .. __TS__StringSubstr(numberString, #hexMatch)
                else
                    ____TS__Match_result__0_0 = __TS__StringSubstr(numberString, #hexMatch)
                end
                numberString = ____TS__Match_result__0_0
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local ____temp_1
        if base <= 10 then
            ____temp_1 = __TS__StringSubstring(parseIntBasePattern, 0, base)
        else
            ____temp_1 = __TS__StringSubstr(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        end
        local allowedDigits = ____temp_1
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber(
            __TS__Match(numberString, pattern),
            base
        )
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end

local function __TS__PromiseAll(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = item.value
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = item
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = data
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        reject(nil, reason)
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAllSettled(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = {status = "fulfilled", value = item.value}
            elseif item.state == 2 then
                results[i + 1] = {status = "rejected", reason = item.rejectionReason}
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = {status = "fulfilled", value = item}
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = {status = "fulfilled", value = data}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        results[index + 1] = {status = "rejected", reason = reason}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAny(iterable)
    local rejections = {}
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                rejections[#rejections + 1] = item.rejectionReason
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    if #pending == 0 then
        return __TS__Promise.reject("No promises to resolve with .any()")
    end
    local numResolved = 0
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, data)
                        resolve(nil, data)
                    end,
                    function(____, reason)
                        rejections[#rejections + 1] = reason
                        numResolved = numResolved + 1
                        if numResolved == #pending then
                            reject(nil, {name = "AggregateError", message = "All Promises rejected", errors = rejections})
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseRace(iterable)
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, value) return resolve(nil, value) end,
                    function(____, reason) return reject(nil, reason) end
                )
            end
        end
    )
end

local Set
do
    Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local ____unpack_0 = unpack
    if ____unpack_0 == nil then
        ____unpack_0 = table.unpack
    end
    local _unpack = ____unpack_0
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
end

local WeakMap
do
    WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
end

local WeakSet
do
    WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
end

local function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        local originalTraceback = debug.traceback
        _G.__TS__originalTraceback = originalTraceback
        debug.traceback = function(thread, message, level)
            local trace
            if thread == nil and message == nil and level == nil then
                trace = originalTraceback()
            elseif __TS__StringIncludes(_VERSION, "Lua 5.0") then
                trace = originalTraceback((("[Level " .. tostring(level)) .. "] ") .. message)
            else
                trace = originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local function replacer(____, file, srcFile, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap and fileSourceMap[line] then
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (srcFile .. ":") .. tostring(data)
                    end
                    return (tostring(data.file) .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            local result = string.gsub(
                trace,
                "(%S+)%.lua:(%d+)",
                function(file, line) return replacer(nil, file .. ".lua", file .. ".ts", line) end
            )
            local function stringReplacer(____, file, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap and fileSourceMap[line] then
                    local chunkName = __TS__Match(file, "%[string \"([^\"]+)\"%]")
                    local sourceName = string.gsub(chunkName, ".lua$", ".ts")
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (sourceName .. ":") .. tostring(data)
                    end
                    return (tostring(data.file) .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            result = string.gsub(
                result,
                "(%[string \"[^\"]+\"%]):(%d+)",
                function(file, line) return stringReplacer(nil, file, line) end
            )
            return result
        end
    end
end

local function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        for i = 0, #iterable - 1 do
            arr[i + 1] = __TS__StringAccess(iterable, i)
        end
    else
        local len = 0
        for ____, item in __TS__Iterator(iterable) do
            len = len + 1
            arr[len] = item
        end
    end
    return __TS__Unpack(arr)
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    local ____string_byte_result_0 = string.byte(self, index + 1)
    if ____string_byte_result_0 == nil then
        ____string_byte_result_0 = 0 / 0
    end
    return ____string_byte_result_0
end

local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return self .. string.sub(
        fillString,
        1,
        math.floor(maxLength)
    )
end

local function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return string.sub(
        fillString,
        1,
        math.floor(maxLength)
    ) .. self
end

local __TS__StringReplace
do
    local sub = string.sub
    function __TS__StringReplace(source, searchValue, replaceValue)
        local startPos, endPos = string.find(source, searchValue, nil, true)
        if not startPos then
            return source
        end
        local before = sub(source, 1, startPos - 1)
        local ____temp_0
        if type(replaceValue) == "string" then
            ____temp_0 = replaceValue
        else
            ____temp_0 = replaceValue(nil, searchValue, startPos - 1, source)
        end
        local replacement = ____temp_0
        local after = sub(source, endPos + 1)
        return (before .. replacement) .. after
    end
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local __TS__StringReplaceAll
do
    local sub = string.sub
    local find = string.find
    function __TS__StringReplaceAll(source, searchValue, replaceValue)
        if type(replaceValue) == "string" then
            local concat = table.concat(
                __TS__StringSplit(source, searchValue),
                replaceValue
            )
            if #searchValue == 0 then
                return (replaceValue .. concat) .. replaceValue
            end
            return concat
        end
        local parts = {}
        local partsIndex = 1
        if #searchValue == 0 then
            parts[1] = replaceValue(nil, "", 0, source)
            partsIndex = 2
            for i = 1, #source do
                parts[partsIndex] = sub(source, i, i)
                parts[partsIndex + 1] = replaceValue(nil, "", i, source)
                partsIndex = partsIndex + 2
            end
        else
            local currentPos = 1
            while true do
                local startPos, endPos = find(source, searchValue, currentPos, true)
                if not startPos then
                    break
                end
                parts[partsIndex] = sub(source, currentPos, startPos - 1)
                parts[partsIndex + 1] = replaceValue(nil, searchValue, startPos - 1, source)
                partsIndex = partsIndex + 2
                currentPos = endPos + 1
            end
            parts[partsIndex] = sub(source, currentPos)
        end
        return table.concat(parts)
    end
end

local function __TS__StringSlice(self, start, ____end)
    if start == nil or start ~= start then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

local function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

local __TS__SymbolRegistryFor, __TS__SymbolRegistryKeyFor
do
    local symbolRegistry = {}
    function __TS__SymbolRegistryFor(key)
        if not symbolRegistry[key] then
            symbolRegistry[key] = __TS__Symbol(key)
        end
        return symbolRegistry[key]
    end
    function __TS__SymbolRegistryKeyFor(sym)
        for key in pairs(symbolRegistry) do
            if symbolRegistry[key] == sym then
                return key
            end
        end
    end
end

local function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

return {
  __TS__ArrayConcat = __TS__ArrayConcat,
  __TS__ArrayEntries = __TS__ArrayEntries,
  __TS__ArrayEvery = __TS__ArrayEvery,
  __TS__ArrayFilter = __TS__ArrayFilter,
  __TS__ArrayForEach = __TS__ArrayForEach,
  __TS__ArrayFind = __TS__ArrayFind,
  __TS__ArrayFindIndex = __TS__ArrayFindIndex,
  __TS__ArrayFrom = __TS__ArrayFrom,
  __TS__ArrayIncludes = __TS__ArrayIncludes,
  __TS__ArrayIndexOf = __TS__ArrayIndexOf,
  __TS__ArrayIsArray = __TS__ArrayIsArray,
  __TS__ArrayJoin = __TS__ArrayJoin,
  __TS__ArrayMap = __TS__ArrayMap,
  __TS__ArrayPush = __TS__ArrayPush,
  __TS__ArrayPushArray = __TS__ArrayPushArray,
  __TS__ArrayReduce = __TS__ArrayReduce,
  __TS__ArrayReduceRight = __TS__ArrayReduceRight,
  __TS__ArrayReverse = __TS__ArrayReverse,
  __TS__ArrayUnshift = __TS__ArrayUnshift,
  __TS__ArraySort = __TS__ArraySort,
  __TS__ArraySlice = __TS__ArraySlice,
  __TS__ArraySome = __TS__ArraySome,
  __TS__ArraySplice = __TS__ArraySplice,
  __TS__ArrayToObject = __TS__ArrayToObject,
  __TS__ArrayFlat = __TS__ArrayFlat,
  __TS__ArrayFlatMap = __TS__ArrayFlatMap,
  __TS__ArraySetLength = __TS__ArraySetLength,
  __TS__AsyncAwaiter = __TS__AsyncAwaiter,
  __TS__Await = __TS__Await,
  __TS__Class = __TS__Class,
  __TS__ClassExtends = __TS__ClassExtends,
  __TS__CloneDescriptor = __TS__CloneDescriptor,
  __TS__CountVarargs = __TS__CountVarargs,
  __TS__Decorate = __TS__Decorate,
  __TS__DecorateParam = __TS__DecorateParam,
  __TS__Delete = __TS__Delete,
  __TS__DelegatedYield = __TS__DelegatedYield,
  Error = Error,
  RangeError = RangeError,
  ReferenceError = ReferenceError,
  SyntaxError = SyntaxError,
  TypeError = TypeError,
  URIError = URIError,
  __TS__FunctionBind = __TS__FunctionBind,
  __TS__Generator = __TS__Generator,
  __TS__InstanceOf = __TS__InstanceOf,
  __TS__InstanceOfObject = __TS__InstanceOfObject,
  __TS__Iterator = __TS__Iterator,
  __TS__LuaIteratorSpread = __TS__LuaIteratorSpread,
  Map = Map,
  __TS__Match = __TS__Match,
  __TS__MathAtan2 = __TS__MathAtan2,
  __TS__MathModf = __TS__MathModf,
  __TS__MathSign = __TS__MathSign,
  __TS__Modulo50 = __TS__Modulo50,
  __TS__New = __TS__New,
  __TS__Number = __TS__Number,
  __TS__NumberIsFinite = __TS__NumberIsFinite,
  __TS__NumberIsNaN = __TS__NumberIsNaN,
  __TS__NumberToString = __TS__NumberToString,
  __TS__ObjectAssign = __TS__ObjectAssign,
  __TS__ObjectDefineProperty = __TS__ObjectDefineProperty,
  __TS__ObjectEntries = __TS__ObjectEntries,
  __TS__ObjectFromEntries = __TS__ObjectFromEntries,
  __TS__ObjectGetOwnPropertyDescriptor = __TS__ObjectGetOwnPropertyDescriptor,
  __TS__ObjectGetOwnPropertyDescriptors = __TS__ObjectGetOwnPropertyDescriptors,
  __TS__ObjectKeys = __TS__ObjectKeys,
  __TS__ObjectRest = __TS__ObjectRest,
  __TS__ObjectValues = __TS__ObjectValues,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__ParseInt = __TS__ParseInt,
  __TS__Promise = __TS__Promise,
  __TS__PromiseAll = __TS__PromiseAll,
  __TS__PromiseAllSettled = __TS__PromiseAllSettled,
  __TS__PromiseAny = __TS__PromiseAny,
  __TS__PromiseRace = __TS__PromiseRace,
  Set = Set,
  __TS__SetDescriptor = __TS__SetDescriptor,
  __TS__SparseArrayNew = __TS__SparseArrayNew,
  __TS__SparseArrayPush = __TS__SparseArrayPush,
  __TS__SparseArraySpread = __TS__SparseArraySpread,
  WeakMap = WeakMap,
  WeakSet = WeakSet,
  __TS__SourceMapTraceBack = __TS__SourceMapTraceBack,
  __TS__Spread = __TS__Spread,
  __TS__StringAccess = __TS__StringAccess,
  __TS__StringCharAt = __TS__StringCharAt,
  __TS__StringCharCodeAt = __TS__StringCharCodeAt,
  __TS__StringEndsWith = __TS__StringEndsWith,
  __TS__StringIncludes = __TS__StringIncludes,
  __TS__StringPadEnd = __TS__StringPadEnd,
  __TS__StringPadStart = __TS__StringPadStart,
  __TS__StringReplace = __TS__StringReplace,
  __TS__StringReplaceAll = __TS__StringReplaceAll,
  __TS__StringSlice = __TS__StringSlice,
  __TS__StringSplit = __TS__StringSplit,
  __TS__StringStartsWith = __TS__StringStartsWith,
  __TS__StringSubstr = __TS__StringSubstr,
  __TS__StringSubstring = __TS__StringSubstring,
  __TS__StringTrim = __TS__StringTrim,
  __TS__StringTrimEnd = __TS__StringTrimEnd,
  __TS__StringTrimStart = __TS__StringTrimStart,
  __TS__Symbol = __TS__Symbol,
  Symbol = Symbol,
  __TS__SymbolRegistryFor = __TS__SymbolRegistryFor,
  __TS__SymbolRegistryKeyFor = __TS__SymbolRegistryKeyFor,
  __TS__TypeOf = __TS__TypeOf,
  __TS__Unpack = __TS__Unpack
}
 end,
["StalkerModBase"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
function ____exports.Log(message)
    if not ____exports.StalkerModBase.IsLogEnabled then
        return
    end
    log((((("[" .. ____exports.StalkerModBase.ModName) .. ":") .. tostring(time_global())) .. "] ") .. message)
end
____exports.StalkerModBase = __TS__Class()
local StalkerModBase = ____exports.StalkerModBase
StalkerModBase.name = "StalkerModBase"
function StalkerModBase.prototype.____constructor(self)
end
function StalkerModBase.prototype.OnBeforeLevelChanging(self)
    ____exports.Log("OnBeforeLevelChanging")
end
function StalkerModBase.prototype.OnLevelChanging(self)
    ____exports.Log("OnLevelChanging")
end
function StalkerModBase.prototype.OnActorNetDestroy(self)
end
function StalkerModBase.prototype.OnActorFirstUpdate(self)
end
function StalkerModBase.prototype.OnActorUpdate(self)
end
function StalkerModBase.prototype.OnActorBeforeHit(self, shit, boneId)
    return true
end
function StalkerModBase.prototype.OnActorHit(self, amount, localDirection, attacker, boneId)
end
function StalkerModBase.prototype.OnMonsterNetSpawn(self, monster, serverObject)
end
function StalkerModBase.prototype.OnMonsterNetDestroy(self, monster)
end
function StalkerModBase.prototype.OnMonsterBeforeHit(self, monster, shit, boneId)
    local weapon = level.object_by_id(shit.weapon_id)
    return true
end
function StalkerModBase.prototype.OnMonsterHit(self, monster, amount, localDirection, attacker, boneId)
end
function StalkerModBase.prototype.OnMonsterDeath(self, monster, killer)
end
function StalkerModBase.prototype.OnMonsterActorUse(self, monster, user)
end
function StalkerModBase.prototype.OnMonsterLootInit(self, monster, lootTable)
end
function StalkerModBase.prototype.OnNpcNetSpawn(self, npc, serverObject)
end
function StalkerModBase.prototype.OnNpcNetDestroy(self, npc)
end
function StalkerModBase.prototype.OnNPCBeforeHit(self, npc, shit, boneId)
    return true
end
function StalkerModBase.prototype.OnNPCHit(self, npc, amount, localDirection, attacker, boneId)
end
function StalkerModBase.prototype.OnNPCDeath(self, npc, killer)
end
function StalkerModBase.prototype.OnSimulationFillStartPosition(self)
    ____exports.Log("OnSimulationFillStartPosition")
end
function StalkerModBase.prototype.OnSmartTerrainTryRespawn(self, smart)
    return true
end
function StalkerModBase.prototype.OnServerEntityRegister(self, serverObject, ____type)
end
function StalkerModBase.prototype.OnServerEntityUnregister(self, serverObject, ____type)
end
function StalkerModBase.prototype.OnSaveState(self, data)
    ____exports.Log("OnSaveState")
end
function StalkerModBase.prototype.OnLoadState(self, data)
    ____exports.Log("OnLoadState")
end
function StalkerModBase.prototype.OnItemNetSpawn(self, item, serverObject)
end
function StalkerModBase.prototype.OnItemTake(self, item)
end
function StalkerModBase.prototype.OnItemDrop(self, item)
    ____exports.Log("OnItemDrop " .. item:name())
end
function StalkerModBase.prototype.OnWeaponFired(self, obj, wpn, ammo_elapsed)
    ____exports.Log((("OnWeaponFired " .. wpn:name()) .. " by ") .. obj:name())
end
function StalkerModBase.prototype.OnItemFocusReceive(self, item)
end
function StalkerModBase.prototype.RegisterCallbacks(self)
    ____exports.Log("Register callbacks")
    RegisterScriptCallback(
        "on_before_level_changing",
        function() return self:OnBeforeLevelChanging() end
    )
    RegisterScriptCallback(
        "on_level_changing",
        function() return self:OnLevelChanging() end
    )
    RegisterScriptCallback(
        "actor_on_net_destroy",
        function() return self:OnActorNetDestroy() end
    )
    RegisterScriptCallback(
        "actor_on_first_update",
        function() return self:OnActorFirstUpdate() end
    )
    RegisterScriptCallback(
        "actor_on_update",
        function() return self:OnActorUpdate() end
    )
    RegisterScriptCallback(
        "actor_on_before_hit",
        function(shit, boneId, flags)
            flags.ret_value = self:OnActorBeforeHit(shit, boneId)
        end
    )
    RegisterScriptCallback(
        "actor_on_hit_callback",
        function(amount, localDirection, attacker, boneId) return self:OnActorHit(amount, localDirection, attacker, boneId) end
    )
    RegisterScriptCallback(
        "actor_on_item_take",
        function(item) return self:OnItemTake(item) end
    )
    RegisterScriptCallback(
        "actor_on_item_drop",
        function(item) return self:OnItemDrop(item) end
    )
    RegisterScriptCallback(
        "actor_on_weapon_fired",
        function(obj, wpn, ammo_elapsed, grenade_elapsed, ammo_type, grenade_type) return self:OnWeaponFired(obj, wpn, ammo_elapsed) end
    )
    RegisterScriptCallback(
        "monster_on_net_spawn",
        function(monster, serverObject) return self:OnMonsterNetSpawn(monster, serverObject) end
    )
    RegisterScriptCallback(
        "monster_on_net_destroy",
        function(monster) return self:OnMonsterNetDestroy(monster) end
    )
    RegisterScriptCallback(
        "monster_on_before_hit",
        function(monster, shit, boneId, flags)
            flags.ret_value = self:OnMonsterBeforeHit(monster, shit, boneId)
        end
    )
    RegisterScriptCallback(
        "monster_on_hit_callback",
        function(monster, amount, localDirection, attacker, boneId) return self:OnMonsterHit(
            monster,
            amount,
            localDirection,
            attacker,
            boneId
        ) end
    )
    RegisterScriptCallback(
        "monster_on_death_callback",
        function(monster, killer) return self:OnMonsterDeath(monster, killer) end
    )
    RegisterScriptCallback(
        "monster_on_actor_use_callback",
        function(monster, actor) return self:OnMonsterActorUse(monster, actor) end
    )
    RegisterScriptCallback(
        "monster_on_loot_init",
        function(monster, lootTable) return self:OnMonsterLootInit(monster, lootTable) end
    )
    RegisterScriptCallback(
        "npc_on_net_spawn",
        function(npc, serverObject) return self:OnNpcNetSpawn(npc, serverObject) end
    )
    RegisterScriptCallback(
        "npc_on_net_destroy",
        function(npc) return self:OnNpcNetDestroy(npc) end
    )
    RegisterScriptCallback(
        "npc_on_before_hit",
        function(npc, shit, boneId, flags)
            flags.ret_value = self:OnNPCBeforeHit(npc, shit, boneId)
        end
    )
    RegisterScriptCallback(
        "npc_on_hit_callback",
        function(npc, amount, localDirection, attacker, boneId) return self:OnNPCHit(
            npc,
            amount,
            localDirection,
            attacker,
            boneId
        ) end
    )
    RegisterScriptCallback(
        "npc_on_death_callback",
        function(npc, killer) return self:OnNPCDeath(npc, killer) end
    )
    RegisterScriptCallback(
        "fill_start_position",
        function() return self:OnSimulationFillStartPosition() end
    )
    RegisterScriptCallback(
        "on_try_respawn",
        function(smart, flags)
            flags.disabled = not self:OnSmartTerrainTryRespawn(smart)
        end
    )
    RegisterScriptCallback(
        "server_entity_on_register",
        function(serverObject, ____type) return self:OnServerEntityRegister(serverObject, ____type) end
    )
    RegisterScriptCallback(
        "server_entity_on_unregister",
        function(serverObject, ____type) return self:OnServerEntityUnregister(serverObject, ____type) end
    )
    RegisterScriptCallback(
        "ActorMenu_on_item_focus_receive",
        function(item) return self:OnItemFocusReceive(item) end
    )
    RegisterScriptCallback(
        "save_state",
        function(data) return self:OnSaveState(data) end
    )
    RegisterScriptCallback(
        "load_state",
        function(data) return self:OnLoadState(data) end
    )
    local oldItemNetSpawn = bind_item.item_binder.net_spawn
    local function newItemNetSpawn(s, serverGO)
        local result = oldItemNetSpawn(s, serverGO)
        if result then
            self:OnItemNetSpawn(s.object, serverGO)
        end
        return result
    end
    bind_item.item_binder.net_spawn = newItemNetSpawn
end
StalkerModBase.ModName = "StarlkerModBase"
StalkerModBase.IsLogEnabled = true
return ____exports
 end,
["StalkerAPI.extensions.basic"] = function(...) 
local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local ____exports = {}
function ____exports.Save(id, varname, val)
    se_save_var(id, "", varname, val)
end
function ____exports.Load(id, varname, def)
    local result = se_load_var(id, "", varname)
    if not result and def then
        return def
    end
    return result
end
function ____exports.CreateWorldPositionAtGO(object)
    return {
        object:position(),
        object:level_vertex_id(),
        object:game_vertex_id()
    }
end
function ____exports.CreateWorldPositionAtPosWithGO(offset, object)
    return {
        object:position():add(offset),
        object:level_vertex_id(),
        object:game_vertex_id()
    }
end
function ____exports.CreateVector(x, y, z)
    if y == nil then
        y = 0
    end
    if z == nil then
        z = 0
    end
    return vector():set(x, y, z)
end
function ____exports.EnableMutantLootingWithoutKnife()
    item_knife.is_equipped = function() return true end
    item_knife.get_condition = function() return 1 end
    item_knife.degradate = function()
    end
    item_knife.can_loot = function(monster) return true end
    item_knife.is_axe = function() return false end
end
function ____exports.IsPctRolled(value)
    return math.random(100) < value
end
function ____exports.MapToTable(map)
    local result = {}
    map:forEach(function(____, v, k, _map)
        result[k] = v
        return nil
    end)
    return result
end
function ____exports.TableToMap(tbl)
    local result = __TS__New(Map)
    for key, value in pairs(tbl) do
        result:set(key, value)
    end
    return result
end
function ____exports.RandomFromArray(array)
    local index = math.random(0, #array - 1)
    return array[index + 1]
end
function ____exports.TakeRandomFromArray(array)
    local index = math.random(0, #array - 1)
    local element = array[index + 1]
    __TS__ArraySplice(array, index, 1)
    return element
end
function ____exports.NumberToCondList(value)
    return xr_logic.parse_condlist(
        nil,
        nil,
        nil,
        tostring(value)
    )
end
return ____exports
 end,
["MonsterWorldMod.MonsterWorldConfig"] = function(...) 
local ____exports = {}
____exports.LevelType = LevelType or ({})
____exports.LevelType.None = 0
____exports.LevelType[____exports.LevelType.None] = "None"
____exports.LevelType.Open = 1
____exports.LevelType[____exports.LevelType.Open] = "Open"
____exports.LevelType.Underground = 2
____exports.LevelType[____exports.LevelType.Underground] = "Underground"
____exports.LevelType.Lab = 4
____exports.LevelType[____exports.LevelType.Lab] = "Lab"
____exports.LevelType.NonLab = 3
____exports.LevelType[____exports.LevelType.NonLab] = "NonLab"
____exports.LevelType.All = 7
____exports.LevelType[____exports.LevelType.All] = "All"
local level = 1
local ____level_0 = level
level = ____level_0 + 1
local ____temp_43 = {level = ____level_0, type = ____exports.LevelType.Open}
local ____level_1 = level
level = ____level_1 + 1
local ____temp_44 = {level = ____level_1, type = ____exports.LevelType.Open}
local ____level_2 = level
level = ____level_2 + 1
local ____temp_45 = {level = ____level_2, type = ____exports.LevelType.Open}
local ____level_3 = level
level = ____level_3 + 1
local ____temp_46 = {level = ____level_3, type = ____exports.LevelType.Open}
local ____level_4 = level
level = ____level_4 + 1
local ____temp_47 = {level = ____level_4, type = ____exports.LevelType.Open}
local ____level_5 = level
level = ____level_5 + 1
local ____temp_48 = {level = ____level_5, type = ____exports.LevelType.Open}
local ____level_6 = level
level = ____level_6 + 1
local ____temp_49 = {level = ____level_6, type = ____exports.LevelType.Open}
local ____level_7 = level
level = ____level_7 + 1
local ____temp_50 = {level = ____level_7, type = ____exports.LevelType.Open}
local ____level_8 = level
level = ____level_8 + 1
local ____temp_51 = {level = ____level_8, type = ____exports.LevelType.Open}
local ____level_9 = level
level = ____level_9 + 1
local ____temp_52 = {level = ____level_9, type = ____exports.LevelType.Open}
local ____level_10 = level
level = ____level_10 + 1
local ____temp_53 = {level = ____level_10, type = ____exports.LevelType.Open}
local ____level_11 = level
level = ____level_11 + 1
local ____temp_54 = {level = ____level_11, type = ____exports.LevelType.Open}
local ____level_12 = level
level = ____level_12 + 1
local ____temp_55 = {level = ____level_12, type = ____exports.LevelType.Open}
local ____level_13 = level
level = ____level_13 + 1
local ____temp_56 = {level = ____level_13, type = ____exports.LevelType.Open}
local ____level_14 = level
level = ____level_14 + 1
local ____temp_57 = {level = ____level_14, type = ____exports.LevelType.Open}
local ____level_15 = level
level = ____level_15 + 1
local ____temp_58 = {level = ____level_15, type = ____exports.LevelType.Open}
local ____level_16 = level
level = ____level_16 + 1
local ____temp_59 = {level = ____level_16, type = ____exports.LevelType.Open}
local ____level_17 = level
level = ____level_17 + 1
local ____temp_60 = {level = ____level_17, type = ____exports.LevelType.Open}
local ____level_18 = level
level = ____level_18 + 1
local ____temp_61 = {level = ____level_18, type = ____exports.LevelType.Open}
local ____level_19 = level
level = ____level_19 + 1
local ____temp_62 = {level = ____level_19, type = ____exports.LevelType.Open}
local ____level_20 = level
level = ____level_20 + 1
local ____temp_63 = {level = ____level_20, type = ____exports.LevelType.Open}
local ____level_21 = level
level = ____level_21 + 1
local ____temp_64 = {level = ____level_21, type = ____exports.LevelType.Open}
local ____level_22 = level
level = ____level_22 + 1
local ____temp_65 = {level = ____level_22, type = ____exports.LevelType.Open}
local ____exports_LevelType_Underground_24 = ____exports.LevelType.Underground
local ____level_23 = level
level = ____level_23 + 1
local ____temp_66 = {type = ____exports_LevelType_Underground_24, level = ____level_23}
local ____exports_LevelType_Underground_26 = ____exports.LevelType.Underground
local ____level_25 = level
level = ____level_25 + 1
local ____temp_67 = {type = ____exports_LevelType_Underground_26, level = ____level_25}
local ____exports_LevelType_Underground_28 = ____exports.LevelType.Underground
local ____level_27 = level
level = ____level_27 + 1
local ____temp_68 = {type = ____exports_LevelType_Underground_28, level = ____level_27}
local ____exports_LevelType_Underground_30 = ____exports.LevelType.Underground
local ____level_29 = level
level = ____level_29 + 1
local ____temp_69 = {type = ____exports_LevelType_Underground_30, level = ____level_29}
local ____exports_LevelType_Underground_32 = ____exports.LevelType.Underground
local ____level_31 = level
level = ____level_31 + 1
local ____temp_70 = {type = ____exports_LevelType_Underground_32, level = ____level_31}
local ____exports_LevelType_Underground_34 = ____exports.LevelType.Underground
local ____level_33 = level
level = ____level_33 + 1
local ____temp_71 = {type = ____exports_LevelType_Underground_34, level = ____level_33}
local ____exports_LevelType_Lab_36 = ____exports.LevelType.Lab
local ____level_35 = level
level = ____level_35 + 1
local ____temp_72 = {type = ____exports_LevelType_Lab_36, level = ____level_35}
local ____exports_LevelType_Lab_38 = ____exports.LevelType.Lab
local ____level_37 = level
level = ____level_37 + 1
local ____temp_73 = {type = ____exports_LevelType_Lab_38, level = ____level_37}
local ____exports_LevelType_Lab_40 = ____exports.LevelType.Lab
local ____level_39 = level
level = ____level_39 + 1
local ____temp_74 = {type = ____exports_LevelType_Lab_40, level = ____level_39}
local ____exports_LevelType_Lab_42 = ____exports.LevelType.Lab
local ____level_41 = level
level = ____level_41 + 1
____exports.LocationConfigs = {
    l01_escape = ____temp_43,
    l02_garbage = ____temp_44,
    k00_marsh = ____temp_45,
    l03_agroprom = ____temp_46,
    l04_darkvalley = ____temp_47,
    k01_darkscape = ____temp_48,
    l05_bar = ____temp_49,
    l06_rostok = ____temp_50,
    l08_yantar = ____temp_51,
    l07_military = ____temp_52,
    k02_trucks_cemetery = ____temp_53,
    l09_deadcity = ____temp_54,
    l10_limansk = ____temp_55,
    l10_radar = ____temp_56,
    l10_red_forest = ____temp_57,
    pripyat = ____temp_58,
    l11_pripyat = ____temp_59,
    l12_stancia = ____temp_60,
    l12_stancia_2 = ____temp_61,
    l13_generators = ____temp_62,
    y04_pole = ____temp_63,
    jupiter = ____temp_64,
    zaton = ____temp_65,
    l03u_agr_underground = ____temp_66,
    l10u_bunker = ____temp_67,
    l11_hospital = ____temp_68,
    jupiter_underground = ____temp_69,
    l12u_control_monolith = ____temp_70,
    l12u_sarcofag = ____temp_71,
    l04u_labx18 = ____temp_72,
    l08u_brainlab = ____temp_73,
    l13u_warlab = ____temp_74,
    labx8 = {type = ____exports_LevelType_Lab_42, level = ____level_41}
}
____exports.MonsterType = MonsterType or ({})
____exports.MonsterType.Dog = "Dog"
____exports.MonsterType.PseudoDog = "Pseudo Dog"
____exports.MonsterType.Cat = "Cat"
____exports.MonsterType.Boar = "Boar"
____exports.MonsterType.Snork = "Snork"
____exports.MonsterType.Lurker = "Lurker"
____exports.MonsterType.Bloodsucker = "Bloodsucker"
____exports.MonsterType.Fracture = "Fracture"
____exports.MonsterType.Flesh = "Flesh"
____exports.MonsterType.Chimera = "Chimera"
____exports.MonsterType.Burer = "Burer"
____exports.MonsterType.Controller = "Controller"
____exports.MonsterType.Psysucker = "Psysucker"
____exports.MonsterType.Giant = "Giant"
____exports.MonsterRank = MonsterRank or ({})
____exports.MonsterRank.Common = 0
____exports.MonsterRank[____exports.MonsterRank.Common] = "Common"
____exports.MonsterRank.Elite = 1
____exports.MonsterRank[____exports.MonsterRank.Elite] = "Elite"
____exports.MonsterRank.Boss = 2
____exports.MonsterRank[____exports.MonsterRank.Boss] = "Boss"
____exports.MonsterConfigs = {}
____exports.MonsterConfigs[____exports.MonsterType.Flesh] = {
    type = ____exports.MonsterType.Flesh,
    level_start = 1,
    level_type = ____exports.LevelType.Open,
    hp_mult = 1.4,
    xp_mult = 1.2,
    squad_size_min = 5,
    squad_size_max = 10,
    common_section = "flesh_01a_weak",
    elite_section = "flesh_02a_normal",
    boss_section = "flesh_bolot"
}
____exports.MonsterConfigs[____exports.MonsterType.Boar] = {
    type = ____exports.MonsterType.Boar,
    level_type = ____exports.LevelType.Open,
    level_start = 1,
    hp_mult = 1.25,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "boar_01a_weak",
    elite_section = "boar_02a_strong",
    boss_section = "boar_02a_hard"
}
____exports.MonsterConfigs[____exports.MonsterType.Dog] = {
    type = ____exports.MonsterType.Dog,
    level_type = ____exports.LevelType.Open,
    level_start = 2,
    hp_mult = 0.5,
    xp_mult = 0.4,
    squad_size_min = 6,
    squad_size_max = 12,
    common_section = "dog_weak_white",
    elite_section = "dog_strong_red",
    boss_section = "dog_strong_black"
}
____exports.MonsterConfigs[____exports.MonsterType.Cat] = {
    type = ____exports.MonsterType.Cat,
    level_start = 3,
    level_type = ____exports.LevelType.Open,
    hp_mult = 0.75,
    xp_mult = 0.75,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "cat_normal_d",
    elite_section = "cat_strong_b",
    boss_section = "cat_strong_afro"
}
____exports.MonsterConfigs[____exports.MonsterType.PseudoDog] = {
    type = ____exports.MonsterType.PseudoDog,
    level_start = 4,
    level_type = ____exports.LevelType.All,
    hp_mult = 1.25,
    damage_mult = 1.25,
    xp_mult = 1.25,
    squad_size_min = 3,
    squad_size_max = 6,
    common_section = "pseudodog_weak",
    elite_section = "pseudodog_strong",
    boss_section = "pseudodog_arena"
}
____exports.MonsterConfigs[____exports.MonsterType.Snork] = {
    type = ____exports.MonsterType.Snork,
    level_start = 5,
    level_type = ____exports.LevelType.All,
    hp_mult = 1.5,
    xp_mult = 1.25,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "snork_weak3",
    elite_section = "snork_strong2",
    boss_section = "snork_strong_no_mask"
}
____exports.MonsterConfigs[____exports.MonsterType.Lurker] = {
    type = ____exports.MonsterType.Lurker,
    level_start = 5,
    level_type = ____exports.LevelType.Open,
    hp_mult = 1.25,
    damage_mult = 1.5,
    xp_mult = 1.35,
    squad_size_min = 3,
    squad_size_max = 8,
    common_section = "lurker_1_weak",
    elite_section = "lurker_2_normal",
    boss_section = "lurker_3_strong"
}
____exports.MonsterConfigs[____exports.MonsterType.Bloodsucker] = {
    type = ____exports.MonsterType.Bloodsucker,
    level_start = 5,
    level_type = bit.bor(____exports.LevelType.Underground, ____exports.LevelType.Lab),
    hp_mult = 2.5,
    damage_mult = 1.5,
    xp_mult = 2,
    squad_size_min = 2,
    squad_size_max = 4,
    common_section = "bloodsucker_green_weak",
    elite_section = "bloodsucker_red_normal",
    boss_section = "bloodsucker_strong_big"
}
____exports.MonsterConfigs[____exports.MonsterType.Fracture] = {
    type = ____exports.MonsterType.Fracture,
    level_start = 7,
    level_type = ____exports.LevelType.NonLab,
    hp_mult = 1.75,
    xp_mult = 1.35,
    squad_size_min = 3,
    squad_size_max = 7,
    common_section = "fracture_weak",
    elite_section = "fracture_2",
    boss_section = "fracture_3"
}
____exports.MonsterConfigs[____exports.MonsterType.Burer] = {
    type = ____exports.MonsterType.Burer,
    level_start = 7,
    level_type = bit.bor(____exports.LevelType.Lab, ____exports.LevelType.Underground),
    hp_mult = 2.5,
    xp_mult = 1.5,
    squad_size_min = 2,
    squad_size_max = 5,
    common_section = "burer_weak2",
    elite_section = "burer_normal",
    boss_section = "burer_blue_blue"
}
____exports.MonsterConfigs[____exports.MonsterType.Controller] = {
    type = ____exports.MonsterType.Controller,
    level_start = 7,
    level_type = ____exports.LevelType.Lab,
    hp_mult = 6,
    xp_mult = 3,
    squad_size_min = 1,
    squad_size_max = 3,
    common_section = "m_controller_normal666",
    elite_section = "m_controller_normal777",
    boss_section = "m_controller_normal1111"
}
____exports.MonsterConfigs[____exports.MonsterType.Psysucker] = {
    type = ____exports.MonsterType.Psysucker,
    level_start = 15,
    level_type = bit.bor(____exports.LevelType.Lab, ____exports.LevelType.Underground),
    hp_mult = 2,
    damage_mult = 1.25,
    xp_mult = 1.5,
    squad_size_min = 3,
    squad_size_max = 7,
    common_section = "psysucker_white",
    elite_section = "psysucker_brown",
    boss_section = "psysucker_black"
}
____exports.MonsterConfigs[____exports.MonsterType.Giant] = {
    type = ____exports.MonsterType.Giant,
    level_start = 15,
    level_type = ____exports.LevelType.Open,
    hp_mult = 8,
    damage_mult = 2,
    xp_mult = 3,
    squad_size_min = 1,
    squad_size_max = 3,
    common_section = "gigant_weak",
    elite_section = "gigant_normal",
    boss_section = "gigant_strong"
}
____exports.MonsterConfigs[____exports.MonsterType.Chimera] = {
    type = ____exports.MonsterType.Chimera,
    level_start = 15,
    level_type = ____exports.LevelType.Open,
    hp_mult = 4,
    damage_mult = 3,
    xp_mult = 3,
    squad_size_min = 2,
    squad_size_max = 5,
    common_section = "chimera_weak",
    elite_section = "chimera_strong",
    boss_section = "chimera_strong4"
}
____exports.PlayerHPBase = 100
____exports.PlayerHPPerLevel = 10
____exports.PlayerXPForFirstLevel = 250
____exports.PlayerXPExp = 1.3
____exports.PlayerXPPct = 100
____exports.PlayerPointsPerLevelUp = 1
____exports.EnemyHPBase = 50
____exports.EnemyHPExpPerLevel = 1.1
____exports.EnemyHPPctPerLevel = 25
____exports.EnemyHpDeltaPct = 10
____exports.EnemyDamageBase = ____exports.PlayerHPBase / 25
____exports.EnemyDamageExpPerLevel = 1
____exports.EnemyDamagePctPerLevel = 10
____exports.EnemyXpRewardBase = 10
____exports.EnemyXpRewardExpPerLevel = 1.25
____exports.EnemyXpRewardPctPerLevel = 25
____exports.EnemyHigherLevelChance = 5
____exports.EnemyEliteChance = 15
____exports.EnemyBossChance = 5
____exports.EnemyBossHPMult = 10
____exports.EnemyBossXPRewardMult = 10
____exports.EnemyBossDamageMult = 2.5
____exports.EnemyBossDropLevelIncreaseChance = 50
____exports.EnemyBossDropQualityIncreaseChance = 50
____exports.EnemyEliteHPMult = 3
____exports.EnemyEliteXPRewardMult = 3
____exports.EnemyEliteDamageMult = 1.5
____exports.EnemyEliteDropLevelIncreaseChance = 20
____exports.EnemyEliteDropQualityIncreaseChance = 20
____exports.WeaponDPSBase = ____exports.EnemyHPBase / 0.2
____exports.WeaponDPSExpPerLevel = ____exports.EnemyHPExpPerLevel
____exports.WeaponDPSDeltaPct = 10
____exports.WeaponDPSPctPerQuality = 25
____exports.EnemyDropChance = 200
____exports.EnemyBossDropChance = 100
____exports.EnemyEliteDropChance = 50
____exports.MinQuality = 1
____exports.MaxQuality = 5
____exports.HigherLevelDropChancePct = 5
____exports.QualityDropChance = {{30, 2}, {15, 3}, {7, 4}, {3, 5}}
____exports.Qualities = {
    [1] = "Common",
    [2] = "Uncommon",
    [3] = "Rare",
    [4] = "Epic",
    [5] = "Legendary"
}
____exports.ParticlesByQuality = {
    [1] = "industrial_particles\\exhaust_workshop_1_small",
    [2] = "anomaly2\\electra_damage_02_smoke",
    [3] = "artefact\\af_acidic_idle",
    [4] = "artefact\\af_thermal_idle",
    [5] = "weapons\\rpg_trail_01"
}
____exports.QualityColors = {
    [1] = GetARGB(255, 230, 230, 230),
    [2] = GetARGB(255, 20, 20, 230),
    [3] = GetARGB(255, 20, 230, 20),
    [4] = GetARGB(255, 230, 20, 20),
    [5] = GetARGB(255, 240, 165, 5)
}
____exports.MonsterRankColors = {
    [0] = GetARGB(255, 120, 250, 30),
    [1] = GetARGB(255, 20, 20, 240),
    [2] = GetARGB(255, 240, 20, 20)
}
____exports.EndColorTag = "%c[default]"
____exports.LevelColor = "%c[255,104,210,26]"
return ____exports
 end,
["MonsterWorldMod.MonsterWorldBones"] = function(...) 
local ____exports = {}
local ____MonsterWorldConfig = require("MonsterWorldMod.MonsterWorldConfig")
local MonsterType = ____MonsterWorldConfig.MonsterType
local dogBones = {15}
local bloodsuckerBones = {14}
local chimeraBones = {
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    34,
    34
}
____exports.CriticalBones = {
    [MonsterType.Dog] = dogBones,
    [MonsterType.Boar] = {20},
    [MonsterType.Cat] = {13},
    [MonsterType.PseudoDog] = dogBones,
    [MonsterType.Bloodsucker] = bloodsuckerBones,
    [MonsterType.Fracture] = {13},
    [MonsterType.Snork] = {4},
    [MonsterType.Lurker] = chimeraBones,
    [MonsterType.Flesh] = {13},
    [MonsterType.Chimera] = chimeraBones,
    [MonsterType.Burer] = {
        39,
        40,
        41,
        42,
        44,
        45,
        47,
        48
    },
    [MonsterType.Controller] = {31},
    [MonsterType.Psysucker] = bloodsuckerBones,
    [MonsterType.Giant] = {
        1,
        2,
        3,
        4,
        5
    }
}
return ____exports
 end,
["MonsterWorldMod.MWMonster"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____BaseMWObject = require("MonsterWorldMod.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
local ____MonsterWorldConfig = require("MonsterWorldMod.MonsterWorldConfig")
local MonsterRank = ____MonsterWorldConfig.MonsterRank
____exports.MWMonster = __TS__Class()
local MWMonster = ____exports.MWMonster
MWMonster.name = "MWMonster"
__TS__ClassExtends(MWMonster, BaseMWObject)
function MWMonster.prototype.____constructor(self, mw, id)
    BaseMWObject.prototype.____constructor(self, mw, id)
    self.mw = mw
    self.id = id
end
__TS__SetDescriptor(
    MWMonster.prototype,
    "Name",
    {get = function(self)
        local nameInfo = (self.Type .. " L.") .. tostring(self.Level)
        if self.Rank == MonsterRank.Boss then
            nameInfo = "[Boss] " .. nameInfo
        elseif self.Rank == MonsterRank.Elite then
            nameInfo = "[Elite] " .. nameInfo
        end
        return nameInfo
    end},
    true
)
__TS__SetDescriptor(
    MWMonster.prototype,
    "DropChance",
    {get = function(self)
        if self.Rank == MonsterRank.Boss then
            return cfg.EnemyBossDropChance
        end
        if self.Rank == MonsterRank.Elite then
            return cfg.EnemyEliteDropChance
        end
        return cfg.EnemyDropChance
    end},
    true
)
__TS__SetDescriptor(
    MWMonster.prototype,
    "XPReward",
    {
        get = function(self)
            return self:Load("XPReward")
        end,
        set = function(self, expReward)
            self:Save("XPReward", expReward)
        end
    },
    true
)
__TS__SetDescriptor(
    MWMonster.prototype,
    "Damage",
    {
        get = function(self)
            return self:Load("DMG")
        end,
        set = function(self, damage)
            self:Save("DMG", damage)
        end
    },
    true
)
__TS__SetDescriptor(
    MWMonster.prototype,
    "Rank",
    {
        get = function(self)
            return self:Load("Rank")
        end,
        set = function(self, rank)
            self:Save("Rank", rank)
        end
    },
    true
)
__TS__SetDescriptor(
    MWMonster.prototype,
    "Type",
    {
        get = function(self)
            return self:Load("Type")
        end,
        set = function(self, ____type)
            self:Save("Type", ____type)
        end
    },
    true
)
function MWMonster.prototype.Initialize(self)
    local spawnConfig = self:Load("SpawnParams")
    self.Type = spawnConfig.type
    self.Level = spawnConfig.level
    self.Rank = spawnConfig.rank
    local enemyHP = self:GetMaxHP(self.Level) * spawnConfig.hpMult
    local xpReward = self:GetXPReward(self.Level) * spawnConfig.xpMult
    local enemyDamage = self:GetDamage(self.Level) * spawnConfig.damageMult
    if spawnConfig.rank == MonsterRank.Boss then
        enemyHP = enemyHP * cfg.EnemyBossHPMult
        xpReward = xpReward * cfg.EnemyBossXPRewardMult
        enemyDamage = enemyDamage * cfg.EnemyBossDamageMult
    elseif spawnConfig.rank == MonsterRank.Elite then
        enemyHP = enemyHP * cfg.EnemyEliteHPMult
        xpReward = xpReward * cfg.EnemyEliteXPRewardMult
        enemyDamage = enemyDamage * cfg.EnemyEliteDamageMult
    end
    self.MaxHP = enemyHP
    self.HP = enemyHP
    self.Damage = enemyDamage
    self.XPReward = xpReward
    se_save_var(
        self.id,
        self.GO:name(),
        "looted",
        true
    )
end
function MWMonster.prototype.GetMaxHP(self, level)
    local pctMult = 1 + cfg.EnemyHPPctPerLevel / 100 * (level - 1)
    local expMult = math.pow(cfg.EnemyHPExpPerLevel, level - 1)
    local deltaMult = 1 + math.random(-cfg.EnemyHpDeltaPct, cfg.EnemyHpDeltaPct) / 100
    return cfg.EnemyHPBase * pctMult * expMult * deltaMult
end
function MWMonster.prototype.GetXPReward(self, level)
    local pctMult = 1 + cfg.EnemyXpRewardPctPerLevel / 100 * (level - 1)
    local expMult = math.pow(cfg.EnemyXpRewardExpPerLevel, level - 1)
    local xp = cfg.EnemyXpRewardBase * pctMult * expMult
    return math.floor(xp)
end
function MWMonster.prototype.GetDamage(self, level)
    return cfg.EnemyDamageBase * math.pow(cfg.EnemyDamageExpPerLevel, level - 1)
end
return ____exports
 end,
["MonsterWorldMod.MonsterWorldMod"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local Map = ____lualib.Map
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__ArrayIndexOf = ____lualib.__TS__ArrayIndexOf
local ____exports = {}
local ____basic = require("StalkerAPI.extensions.basic")
local EnableMutantLootingWithoutKnife = ____basic.EnableMutantLootingWithoutKnife
local ____StalkerModBase = require("StalkerModBase")
local StalkerModBase = ____StalkerModBase.StalkerModBase
local ____MonsterWorld = require("MonsterWorldMod.MonsterWorld")
local MonsterWorld = ____MonsterWorld.MonsterWorld
local ____MonsterWorldBones = require("MonsterWorldMod.MonsterWorldBones")
local CriticalBones = ____MonsterWorldBones.CriticalBones
____exports.MonsterWorldMod = __TS__Class()
local MonsterWorldMod = ____exports.MonsterWorldMod
MonsterWorldMod.name = "MonsterWorldMod"
__TS__ClassExtends(MonsterWorldMod, StalkerModBase)
function MonsterWorldMod.prototype.____constructor(self)
    StalkerModBase.prototype.____constructor(self)
    self.hitsThisFrame = {}
    self.lastHitFrame = -1
    self.monsterHitsThisFrame = __TS__New(Map)
    StalkerModBase.ModName = "MonsterWorldMod"
    StalkerModBase.IsLogEnabled = true
    self.World = __TS__New(MonsterWorld, self)
    self:RegisterCallbacks()
end
function MonsterWorldMod.prototype.OnSaveState(self, data)
    StalkerModBase.prototype.OnSaveState(self, data)
    self.World:Save(data)
end
function MonsterWorldMod.prototype.OnLoadState(self, data)
    StalkerModBase.prototype.OnLoadState(self, data)
    self.World:Load(data)
end
function MonsterWorldMod.prototype.OnMonsterNetSpawn(self, monster, serverObject)
    self.World:GetMonster(monster:id())
end
function MonsterWorldMod.prototype.OnItemTake(self, item)
    self.World:OnTakeItem(item)
end
function MonsterWorldMod.prototype.OnItemDrop(self, item)
    StalkerModBase.prototype.OnItemDrop(self, item)
    alife_release(alife():object(item:id()))
end
function MonsterWorldMod.prototype.OnWeaponFired(self, obj, wpn, ammo_elapsed)
    if obj:id() == 0 then
        self.World:OnWeaponFired(wpn, ammo_elapsed)
    end
end
function MonsterWorldMod.prototype.OnMonsterNetDestroy(self, monster)
    local ____table_World_DestroyObject_result_0 = self.World
    if ____table_World_DestroyObject_result_0 ~= nil then
        ____table_World_DestroyObject_result_0 = ____table_World_DestroyObject_result_0:DestroyObject(monster:id())
    end
end
function MonsterWorldMod.prototype.OnServerEntityUnregister(self, serverObject, ____type)
    local ____table_World_DestroyObject_result_2 = self.World
    if ____table_World_DestroyObject_result_2 ~= nil then
        ____table_World_DestroyObject_result_2 = ____table_World_DestroyObject_result_2:DestroyObject(serverObject.id)
    end
end
function MonsterWorldMod.prototype.OnActorFirstUpdate(self)
    StalkerModBase.prototype.OnActorFirstUpdate(self)
    EnableMutantLootingWithoutKnife()
    self.World:OnPlayerSpawned()
end
function MonsterWorldMod.prototype.OnActorUpdate(self)
    StalkerModBase.prototype.OnActorUpdate(self)
    self.World:Update()
    if self.monsterHitsThisFrame.size > 0 then
        self.World:OnMonstersHit(self.monsterHitsThisFrame)
        self.monsterHitsThisFrame = __TS__New(Map)
    end
end
function MonsterWorldMod.prototype.OnActorBeforeHit(self, shit, boneId)
    StalkerModBase.prototype.OnActorBeforeHit(self, shit, boneId)
    if not self:CanHit(
        db.actor:id(),
        shit.draftsman:id()
    ) then
        return false
    end
    self.World:OnPlayerHit(shit.draftsman)
    shit.power = 1e-7
    return true
end
function MonsterWorldMod.prototype.OnSimulationFillStartPosition(self)
    StalkerModBase.prototype.OnSimulationFillStartPosition(self)
    self.World.SpawnManager:FillStartPositions()
end
function MonsterWorldMod.prototype.OnSmartTerrainTryRespawn(self, smart)
    return self.World.SpawnManager:OnTryRespawn(smart)
end
function MonsterWorldMod.prototype.OnMonsterBeforeHit(self, monsgerGO, shit, boneId)
    StalkerModBase.prototype.OnMonsterBeforeHit(self, monsgerGO, shit, boneId)
    if monsgerGO.health <= 0 or shit.draftsman:id() ~= 0 then
        return false
    end
    local monster = self.World:GetMonster(monsgerGO:id())
    if monster == nil then
        return false
    end
    local weapon = self.World:GetWeapon(shit.weapon_id)
    if weapon == nil then
        return false
    end
    local isCrit = __TS__ArrayIncludes(CriticalBones[monster.Type], boneId)
    local hitInfo = {monster = monster, weapon = weapon, isCrit = isCrit}
    local currentHitInfo = self.monsterHitsThisFrame:get(monster.id)
    if currentHitInfo ~= nil then
        if not hitInfo.isCrit then
            hitInfo.isCrit = currentHitInfo.isCrit
        end
    end
    self.monsterHitsThisFrame:set(monster.id, hitInfo)
    shit.power = 0
    return true
end
function MonsterWorldMod.prototype.OnMonsterDeath(self, monster, killer)
    if killer:id() ~= 0 then
        return
    end
    self.World:OnMonsterKilled(monster)
end
function MonsterWorldMod.prototype.CanHit(self, target, attacker)
    if self.lastHitFrame ~= time_global() then
        self.hitsThisFrame = {}
        self.lastHitFrame = time_global()
    end
    if __TS__ArrayIndexOf(self.hitsThisFrame, {target, attacker}) >= 0 then
        return false
    end
    local ____self_hitsThisFrame_4 = self.hitsThisFrame
    ____self_hitsThisFrame_4[#____self_hitsThisFrame_4 + 1] = {target, attacker}
    return true
end
function ____exports.StartMonsterWorld()
    ____exports.MOD = __TS__New(____exports.MonsterWorldMod)
end
return ____exports
 end,
["MonsterWorldMod.MWPlayer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____BaseMWObject = require("MonsterWorldMod.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
____exports.MWPlayer = __TS__Class()
local MWPlayer = ____exports.MWPlayer
MWPlayer.name = "MWPlayer"
__TS__ClassExtends(MWPlayer, BaseMWObject)
function MWPlayer.prototype.____constructor(self, mw, id)
    BaseMWObject.prototype.____constructor(self, mw, id)
    self.mw = mw
    self.id = id
end
__TS__SetDescriptor(
    MWPlayer.prototype,
    "RequeiredXP",
    {get = function(self)
        local expMult = math.pow(cfg.PlayerXPExp, self.Level - 1)
        local pctMult = 1 + cfg.PlayerXPPct * (self.Level - 1) / 100
        local xp = cfg.PlayerXPForFirstLevel * expMult * pctMult
        return math.floor(xp)
    end},
    true
)
__TS__SetDescriptor(
    MWPlayer.prototype,
    "CurrentXP",
    {
        get = function(self)
            return self:Load("CurrentXP", 0)
        end,
        set = function(self, exp)
            while exp >= self.RequeiredXP do
                exp = exp - self.RequeiredXP
                self:LevelUp()
            end
            self:Save("CurrentXP", exp)
        end
    },
    true
)
__TS__SetDescriptor(
    MWPlayer.prototype,
    "StatPoints",
    {
        get = function(self)
            return self:Load("StatPoints", 0)
        end,
        set = function(self, points)
            self:Save("StatPoints", points)
        end
    },
    true
)
function MWPlayer.prototype.Initialize(self)
    local baseHP = cfg.PlayerHPBase
    self.Level = 1
    self.CurrentXP = 0
    self.MaxHP = baseHP
    self.HP = baseHP
end
function MWPlayer.prototype.LevelUp(self)
    self.Level = self.Level + 1
    self.StatPoints = self.StatPoints + cfg.PlayerPointsPerLevelUp
    self.MaxHP = self.MaxHP + cfg.PlayerHPPerLevel
end
return ____exports
 end,
["MonsterWorldMod.MWWeapon"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ArraySlice = ____lualib.__TS__ArraySlice
local __TS__StringReplace = ____lualib.__TS__StringReplace
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__StringPadEnd = ____lualib.__TS__StringPadEnd
local ____exports = {}
local BonusParams
local ____basic = require("StalkerAPI.extensions.basic")
local TakeRandomFromArray = ____basic.TakeRandomFromArray
local ____BaseMWObject = require("MonsterWorldMod.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
____exports.MWWeapon = __TS__Class()
local MWWeapon = ____exports.MWWeapon
MWWeapon.name = "MWWeapon"
__TS__ClassExtends(MWWeapon, BaseMWObject)
function MWWeapon.prototype.____constructor(self, mw, id)
    BaseMWObject.prototype.____constructor(self, mw, id)
    self.mw = mw
    self.id = id
end
__TS__SetDescriptor(
    MWWeapon.prototype,
    "Quality",
    {
        get = function(self)
            return self:Load("Quality")
        end,
        set = function(self, quality)
            self:Save("Quality", quality)
        end
    },
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "DamagePerHit",
    {
        get = function(self)
            return self:Load("DamagePerHit")
        end,
        set = function(self, damage)
            self:Save("DamagePerHit", damage)
        end
    },
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "Bonuses",
    {
        get = function(self)
            return self:Load("GeneratedBonuses")
        end,
        set = function(self, bonuses)
            self:Save("GeneratedBonuses", bonuses)
        end
    },
    true
)
function MWWeapon.prototype.Initialize(self)
    local spawnCfg = self:Load("SpawnParams", {level = 1, quality = 1})
    self.Level = spawnCfg.level
    self.Quality = math.max(
        cfg.MinQuality,
        math.min(cfg.MaxQuality, spawnCfg.quality)
    )
    self.Bonuses = {}
    if (string.find(self.Section, "knife", nil, true) or 0) - 1 >= 0 then
        self.DamagePerHit = cfg.WeaponDPSBase * 5
        return
    end
    self:GenerateWeaponStats()
end
function MWWeapon.prototype.GetBonusDescription(self)
    local result = ""
    for ____, ____type in ipairs(____exports.BonusParams.AllParams) do
        local value = self.Bonuses[____type] or 0
        if value ~= 0 then
            result = result .. ____exports.BonusParams.GetBonusDescription(____type, value) .. " \\n"
        end
    end
    return result
end
function MWWeapon.prototype.GenerateWeaponStats(self)
    local ammoMagSize = ini_sys:r_float_ex(self.Section, "ammo_mag_size", 1)
    local rpm = ini_sys:r_float_ex(self.Section, "rpm", 1)
    local fireRate = 60 / rpm
    local baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, self.Level - 1)
    local dps = baseDPS
    local upgradesByType = {}
    upgradesByType[#upgradesByType + 1] = {"damage", {}}
    local upgradeTypes = ____exports.BonusParams.AllParams
    do
        local i = 0
        while i < #upgradeTypes do
            do
                local uType = upgradeTypes[i + 1]
                if uType == "damage" then
                    goto __continue16
                end
                if ini_sys:r_string_ex(self.Section, uType .. "_upgrades", "") ~= "" then
                    local upgrades = ini_sys:r_list(self.Section, uType .. "_upgrades", {})
                    if #upgrades ~= 0 then
                        upgradesByType[#upgradesByType + 1] = {uType, upgrades}
                    end
                end
            end
            ::__continue16::
            i = i + 1
        end
    end
    local selectedUpgradeTypes = {}
    local upgradeTypesToAdd = 2 + math.random(0, self.Quality - 1)
    local upgradeTypesToSelect = math.min(#upgradesByType, upgradeTypesToAdd)
    do
        local i = 0
        while i < upgradeTypesToSelect do
            local upgrades = TakeRandomFromArray(upgradesByType)
            selectedUpgradeTypes[#selectedUpgradeTypes + 1] = upgrades
            i = i + 1
        end
    end
    local damageBonusPct = 0
    local allSelectedUpgrades = {}
    do
        local i = 0
        while i < #selectedUpgradeTypes do
            local upgradesPerTypeToSelect = 1 + self.Level / 10 + (self.Quality - 1) / 2
            local t, upgrades = unpack(selectedUpgradeTypes[i + 1])
            if t == "damage" then
                local bonus = 0
                do
                    local j = 0
                    while j < upgradesPerTypeToSelect do
                        bonus = bonus + math.random(1, 5)
                        j = j + 1
                    end
                end
                damageBonusPct = bonus
            elseif t == "fire_mode" then
                local upgrade = TakeRandomFromArray(upgrades)
                allSelectedUpgrades[#allSelectedUpgrades + 1] = upgrade
                self.Bonuses.fire_mode = 1
            else
                if self.Quality < 3 and #upgrades >= self.Quality + 3 then
                    upgrades = __TS__ArraySlice(
                        upgrades,
                        0,
                        math.min(2 + self.Quality, #upgrades) - 1
                    )
                elseif self.Quality >= 3 and #upgrades >= self.Quality + 3 then
                    upgrades = __TS__ArraySlice(upgrades, 3)
                end
                local toSelect = math.min(
                    upgradesPerTypeToSelect,
                    math.max(1, #upgrades)
                )
                local bonusValue = 0
                do
                    local j = 0
                    while j < toSelect do
                        local upgrade = TakeRandomFromArray(upgrades)
                        allSelectedUpgrades[#allSelectedUpgrades + 1] = upgrade
                        bonusValue = bonusValue + ini_sys:r_float_ex(
                            __TS__StringReplace(upgrade, "mwu", "mwb"),
                            ____exports.BonusParams.SectionFields[t],
                            0
                        )
                        j = j + 1
                    end
                end
                if bonusValue ~= 0 then
                    if __TS__ArrayIncludes(____exports.BonusParams.PctBonuses, t) then
                        local defaultValue = ini_sys:r_float_ex(self.Section, ____exports.BonusParams.SectionFields[t], 1)
                        bonusValue = bonusValue / defaultValue * 100
                    end
                    self.Bonuses[t] = math.abs(bonusValue)
                end
            end
            i = i + 1
        end
    end
    damageBonusPct = damageBonusPct + cfg.WeaponDPSPctPerQuality * (self.Quality - 1)
    if damageBonusPct >= cfg.WeaponDPSDeltaPct then
        damageBonusPct = damageBonusPct + math.random(-cfg.WeaponDPSDeltaPct, cfg.WeaponDPSDeltaPct)
    end
    self.Bonuses.damage = damageBonusPct
    dps = dps * (1 + damageBonusPct / 100)
    self.DamagePerHit = dps * fireRate
    do
        local i = 0
        while i < #allSelectedUpgrades do
            local upgrade = __TS__StringReplace(allSelectedUpgrades[i + 1], "mwu", "mwe")
            self.GO:install_upgrade(upgrade)
            i = i + 1
        end
    end
    self.GO:set_ammo_elapsed(self.GO:cast_Weapon():GetAmmoMagSize())
    self.GO:set_condition(100)
end
____exports.BonusParams = {}
BonusParams = ____exports.BonusParams
do
    local NegativeBonuses, HasNoValue, BonusDescriptions
    BonusParams.AllParams = {
        "damage",
        "rpm",
        "mag_size",
        "dispersion",
        "inertion",
        "recoil",
        "bullet_speed",
        "fire_mode"
    }
    BonusParams.SectionFields = {
        damage = "_NotUsed",
        fire_mode = "_NotUsed",
        rpm = "rpm",
        mag_size = "ammo_mag_size",
        dispersion = "fire_dispersion_base",
        inertion = "crosshair_inertion",
        recoil = "cam_dispersion",
        bullet_speed = "bullet_speed"
    }
    BonusParams.PctBonuses = {
        "damage",
        "rpm",
        "dispersion",
        "inertion",
        "recoil",
        "bullet_speed"
    }
    function BonusParams.GetBonusDescription(____type, bonus)
        if bonus == nil then
            bonus = 0
        end
        if __TS__ArrayIncludes(HasNoValue, ____type) then
            return ("%c[255,255,255,0]" .. BonusDescriptions[____type]) .. cfg.EndColorTag
        end
        local valueStr = ((__TS__ArrayIncludes(NegativeBonuses, ____type) and "-" or "+") .. tostring(math.floor(bonus))) .. (__TS__ArrayIncludes(BonusParams.PctBonuses, ____type) and "%" or "")
        return ((("%c[255,56,166,209]" .. __TS__StringPadEnd(valueStr, 6, " ")) .. cfg.EndColorTag) .. " ") .. BonusDescriptions[____type]
    end
    NegativeBonuses = {"recoil"}
    HasNoValue = {"fire_mode"}
    BonusDescriptions = {
        damage = "Damage",
        rpm = "Fire Rate",
        mag_size = "Mag size",
        fire_mode = "AUTO fire mode enabled",
        dispersion = "Accuracy",
        inertion = "Handling",
        recoil = "Recoil",
        bullet_speed = "Flatness"
    }
end
return ____exports
 end,
["MonsterWorldMod.MonsterWorldSpawns"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local ____exports = {}
local ____basic = require("StalkerAPI.extensions.basic")
local IsPctRolled = ____basic.IsPctRolled
local Load = ____basic.Load
local NumberToCondList = ____basic.NumberToCondList
local RandomFromArray = ____basic.RandomFromArray
local Save = ____basic.Save
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
local ____MonsterWorldConfig = require("MonsterWorldMod.MonsterWorldConfig")
local MonsterRank = ____MonsterWorldConfig.MonsterRank
____exports.MonsterWorldSpawns = __TS__Class()
local MonsterWorldSpawns = ____exports.MonsterWorldSpawns
MonsterWorldSpawns.name = "MonsterWorldSpawns"
function MonsterWorldSpawns.prototype.____constructor(self, world)
    self.world = world
    self.safeSmarts = {}
    local oldSimSquadAddSquadMember = sim_squad_scripted.sim_squad_scripted.add_squad_member
    local function newSimSquadAddSquadMember(obj, section, pos, lvid, gvid)
        return self:OnSimSquadAddMember(
            obj,
            section,
            pos,
            lvid,
            gvid,
            oldSimSquadAddSquadMember
        )
    end
    sim_squad_scripted.sim_squad_scripted.add_squad_member = newSimSquadAddSquadMember
end
function MonsterWorldSpawns.prototype.Save(self, data)
    data.safeSmarts = self.safeSmarts
end
function MonsterWorldSpawns.prototype.Load(self, data)
    self.safeSmarts = data.safeSmarts or ({})
end
function MonsterWorldSpawns.prototype.FillStartPositions(self)
    local setting_ini = ini_file("misc\\simulation.ltx")
    setting_ini:section_for_each(function(section)
        local smart = SIMBOARD.smarts_by_names[section]
        if not smart then
            Log("sim_board:fill_start_position incorrect smart by name " .. section)
            return false
        end
        local lineCount = setting_ini:line_count(section)
        do
            local line = 0
            while line < lineCount do
                do
                    local _res, squad_section, countStr = setting_ini:r_line(section, line)
                    if __TS__StringIncludes(squad_section, "trader") or __TS__StringIncludes(squad_section, "mechanic") or __TS__StringIncludes(squad_section, "barman") then
                        goto __continue9
                    end
                    goto __continue9
                end
                ::__continue9::
                line = line + 1
            end
        end
        return false
    end)
    SIMBOARD.start_position_filled = true
end
function MonsterWorldSpawns.prototype.OnTryRespawn(self, smart)
    if not smart.is_on_actor_level then
        return false
    end
    if self.safeSmarts[smart.id] ~= nil then
        return false
    end
    local respawnInterval = 600
    local maxPopulation = 10
    if not Load(smart.id, "MW_Initialized", false) or smart.respawn_idle ~= respawnInterval or smart.max_population ~= maxPopulation then
        if Load(smart.id, "MW_Initialized", false) then
        end
        smart.respawn_idle = respawnInterval
        smart.max_population = maxPopulation
        local locationCfg = cfg.LocationConfigs[level.name()]
        if not locationCfg then
            return false
        end
        local selectedMonsters = {}
        for monsterType, monsterCfg in pairs(cfg.MonsterConfigs) do
            do
                if monsterCfg.level_start > locationCfg.level then
                    goto __continue17
                end
                if bit.band(monsterCfg.level_type, locationCfg.type) ~= locationCfg.type then
                    goto __continue17
                end
                selectedMonsters[#selectedMonsters + 1] = monsterType
            end
            ::__continue17::
        end
        local selectedMonsterType = RandomFromArray(selectedMonsters)
        Save(smart.id, "MW_MonsterType", selectedMonsterType)
        smart.respawn_params = {spawn_section_1 = {
            num = NumberToCondList(cfg.MonsterConfigs[selectedMonsterType].max_squads_per_smart or 4),
            squads = {"simulation_monster_world"}
        }}
        smart.already_spawned = {spawn_section_1 = {num = 0}}
        smart.faction = "monster"
        smart.respawn_radius = 125
        Save(smart.id, "MW_Initialized", true)
    end
    return true
end
function MonsterWorldSpawns.prototype.OnSimSquadAddMember(self, obj, section, pos, lvid, gvid, defaultFunction)
    if section ~= "dog_normal_red" then
        Log("SPAWN PROBLEM Wrong section " .. section)
        return
    end
    if not obj.smart_id then
        Log("SPAWN PROBLEM  NO SMART!")
        return
    end
    local monsterType = Load(obj.smart_id, "MW_MonsterType", nil)
    local monsterCfg = cfg.MonsterConfigs[monsterType]
    if monsterCfg == nil then
        Log("SPAWN PROBLEM  NO monsterCfg! " .. monsterType)
    end
    local squadSize = math.random(monsterCfg.squad_size_min, monsterCfg.squad_size_max)
    local isBossSpawned = false
    local elitesSpawned = 0
    local locCfg = cfg.LocationConfigs[level.name()]
    local locLevel = locCfg.level or 1
    if locLevel < 10 then
        squadSize = squadSize * (0.5 + 0.05 * locLevel)
    end
    do
        local i = 0
        while i < squadSize do
            do
                local enemyLvl = math.max(locLevel, self.world.Player.Level - 3)
                if IsPctRolled(cfg.EnemyHigherLevelChance) then
                    enemyLvl = enemyLvl + 1
                end
                local rank = MonsterRank.Common
                if not isBossSpawned and IsPctRolled(cfg.EnemyEliteChance) then
                    elitesSpawned = elitesSpawned + 1
                    rank = MonsterRank.Elite
                elseif not isBossSpawned and elitesSpawned == 0 and IsPctRolled(cfg.EnemyBossChance) then
                    isBossSpawned = true
                    rank = MonsterRank.Boss
                end
                local section = monsterCfg.common_section
                if rank == MonsterRank.Elite then
                    section = monsterCfg.elite_section
                elseif rank == MonsterRank.Boss then
                    section = monsterCfg.boss_section
                end
                local monsterId = defaultFunction(
                    obj,
                    section,
                    pos,
                    lvid,
                    gvid
                )
                if monsterId == nil then
                    Log("SPAWN PROBLEM  NO monster!")
                    goto __continue25
                end
                Save(monsterId, "MW_SpawnParams", {
                    type = monsterType,
                    level = enemyLvl,
                    rank = rank,
                    hpMult = monsterCfg.hp_mult or 1,
                    xpMult = monsterCfg.xp_mult or 1,
                    damageMult = monsterCfg.damage_mult or 1
                })
                i = i + 1
            end
            ::__continue25::
        end
    end
end
return ____exports
 end,
["MonsterWorldMod.MonsterWorldUI"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
____exports.MonsterWorldUI = __TS__Class()
local MonsterWorldUI = ____exports.MonsterWorldUI
MonsterWorldUI.name = "MonsterWorldUI"
function MonsterWorldUI.prototype.____constructor(self, world)
    self.world = world
    self.damageNumbers = {}
    self.xpRewardNumbers = {}
    self.lastEnemyHpShowTime = 0
    local oldPrepareStatsTable = utils_ui.prepare_stats_table
    utils_ui.prepare_stats_table = function() return self:PrepareUIItemStatsTable(oldPrepareStatsTable) end
    local oldGetStatsValue = utils_ui.get_stats_value
    utils_ui.get_stats_value = function(obj, sec, gr, stat)
        if type(gr.value_functor) == "function" then
            local cb = gr.value_functor
            return cb(obj, sec)
        end
        return oldGetStatsValue(obj, sec, gr, stat)
    end
    local oldGetItemName = ui_item.get_obj_name
    ui_item.get_obj_name = function(obj) return self:UIGetItemName(
        obj,
        oldGetItemName(obj)
    ) end
    local oldGetItemDesc = ui_item.get_obj_desc
    ui_item.get_obj_desc = function(obj) return self:UIGetItemDescription(
        obj,
        oldGetItemDesc(obj)
    ) end
    local oldUICellItemUpdate = utils_ui.UICellItem.Update
    local function newUICellItemUpdate(s, obj)
        local res = oldUICellItemUpdate(s, obj)
        local ____s_bar_Show_result_0 = s.bar
        if ____s_bar_Show_result_0 ~= nil then
            ____s_bar_Show_result_0 = ____s_bar_Show_result_0:Show(false)
        end
        local ____s_upgr_Show_result_2 = s.upgr
        if ____s_upgr_Show_result_2 ~= nil then
            ____s_upgr_Show_result_2 = ____s_upgr_Show_result_2:Show(false)
        end
        local ____s_mwLevel_Show_result_4 = s.mwLevel
        if ____s_mwLevel_Show_result_4 ~= nil then
            ____s_mwLevel_Show_result_4 = ____s_mwLevel_Show_result_4:Show(false)
        end
        obj = obj or s.ID and level.object_by_id(s.ID)
        if not res or not obj then
            return res
        end
        local weapon = self.world:GetWeapon(obj:id())
        if not weapon then
            return res
        end
        if not s.mwLevel then
            local xml = CScriptXmlInit()
            xml:ParseFile("ui_monster_world.xml")
            s.mwLevel = xml:InitStatic("item_additions:level_text", s.cell)
            s.mwLevel:TextControl():SetFont(GetFontGraffiti19Russian())
        end
        s.mwLevel:SetWndPos(vector2():set(
            3,
            s.cell:GetHeight() - 14
        ))
        s.mwLevel:TextControl():SetText("L. " .. tostring(weapon.Level))
        s.mwLevel:TextControl():SetTextColor(cfg.QualityColors[weapon.Quality])
        s.mwLevel:Show(true)
        return res
    end
    utils_ui.UICellItem.Update = newUICellItemUpdate
    local oldUIInfoItemUpdate = utils_ui.UIInfoItem.Update
    local function newUIInfoItemUpdate(s, obj, sec, flags)
        oldUIInfoItemUpdate(s, obj, sec, flags)
        if not obj then
            return
        end
        local weapon = self.world:GetWeapon(obj:id())
        if not weapon then
            return
        end
        s.name:SetTextColor(cfg.QualityColors[weapon.Quality])
    end
    utils_ui.UIInfoItem.Update = newUIInfoItemUpdate
end
function MonsterWorldUI.prototype.Save(self, data)
end
function MonsterWorldUI.prototype.Load(self, data)
end
function MonsterWorldUI.prototype.Update(self)
    if not self:InitHud() then
        return
    end
    self:UpdateTarget()
    self:UpdateDamageNumbers()
    self:UpdateXpRewardNumbers()
    self:UpdatePlayerLevelBar()
end
function MonsterWorldUI.prototype.ShowDamage(self, damage, isCrit, isKillHit)
    if isCrit == nil then
        isCrit = false
    end
    if isKillHit == nil then
        isKillHit = false
    end
    do
        local i = 0
        while i < #self.damageNumbers do
            do
                local entry = self.damageNumbers[i + 1]
                if entry.text:IsShown() then
                    goto __continue20
                end
                local msg = tostring(math.floor(damage))
                entry.text:SetWndPos(vector2():set(
                    math.random(-15, 15),
                    math.random(-5, 5)
                ))
                entry.showTime = time_global()
                local ____self_7 = entry.text
                local ____self_7_SetTextColor_8 = ____self_7.SetTextColor
                local ____isCrit_6
                if isCrit then
                    ____isCrit_6 = GetARGB(255, 255, 165, 5)
                else
                    ____isCrit_6 = GetARGB(255, 240, 20, 20)
                end
                ____self_7_SetTextColor_8(____self_7, ____isCrit_6)
                local ____self_10 = entry.text
                local ____self_10_SetFont_11 = ____self_10.SetFont
                local ____isCrit_9
                if isCrit then
                    ____isCrit_9 = GetFontGraffiti19Russian()
                else
                    ____isCrit_9 = GetFontLetterica16Russian()
                end
                ____self_10_SetFont_11(____self_10, ____isCrit_9)
                entry.text:SetText(msg .. (isCrit and " X" or ""))
                entry.text:Show(true)
                return
            end
            ::__continue20::
            i = i + 1
        end
    end
end
function MonsterWorldUI.prototype.ShowXPReward(self, reward)
    do
        local i = 0
        while i < #self.xpRewardNumbers do
            do
                local entry = self.xpRewardNumbers[i + 1]
                if entry.text:IsShown() then
                    goto __continue23
                end
                local msg = ("+ " .. tostring(math.floor(reward))) .. " XP"
                entry.text:SetWndPos(vector2():set(
                    math.random(-30, 30),
                    math.random(-3, 3)
                ))
                entry.showTime = time_global()
                entry.text:SetFont(GetFontGraffiti22Russian())
                entry.text:SetText(msg)
                entry.text:Show(true)
                return
            end
            ::__continue23::
            i = i + 1
        end
    end
end
function MonsterWorldUI.prototype.InitHud(self)
    if self.damageNumbersContainer ~= nil and self.enemyHP ~= nil and self.xpRewardNumbersContainer ~= nil then
        return true
    end
    local hud = get_hud()
    if hud == nil then
        return false
    end
    local cs = hud:GetCustomStatic("mp_ah_buy")
    if cs == nil then
        hud:AddCustomStatic("mp_ah_buy", true)
    end
    cs = hud:GetCustomStatic("mp_ah_buy")
    if cs ~= nil then
        local xml = CScriptXmlInit()
        xml:ParseFile("ui_monster_world.xml")
        cs:wnd():SetWndPos(vector2():set(0, 0))
        cs:wnd():Show(true)
        Log("Initializing damage_numbers")
        self.damageNumbersContainer = xml:InitStatic(
            "damage_numbers",
            cs:wnd()
        )
        self.damageNumbersContainer:Show(true)
        do
            local i = 0
            while i < 30 do
                local textEntry = xml:InitTextWnd("damage_numbers:damage_number", self.damageNumbersContainer)
                textEntry:Show(false)
                local ____self_damageNumbers_12 = self.damageNumbers
                ____self_damageNumbers_12[#____self_damageNumbers_12 + 1] = {text = textEntry, showTime = 0}
                i = i + 1
            end
        end
        Log("Initializing xp_reward_numbers")
        self.xpRewardNumbersContainer = xml:InitStatic(
            "xp_reward_numbers",
            cs:wnd()
        )
        self.xpRewardNumbersContainer:Show(true)
        do
            local i = 0
            while i < 30 do
                local textEntry = xml:InitTextWnd("xp_reward_numbers:xp_reward_number", self.xpRewardNumbersContainer)
                textEntry:Show(false)
                local ____self_xpRewardNumbers_13 = self.xpRewardNumbers
                ____self_xpRewardNumbers_13[#____self_xpRewardNumbers_13 + 1] = {text = textEntry, showTime = 0}
                i = i + 1
            end
        end
        Log("Initializing enemy_health")
        self.enemyHP = xml:InitStatic(
            "enemy_health",
            cs:wnd()
        )
        self.enemyHP:Show(false)
        xml:InitStatic("enemy_health:value_progress_background", self.enemyHP)
        self.enemyHPBarProgress = xml:InitProgressBar("enemy_health:value_progress", self.enemyHP)
        self.enemyHPBarName = xml:InitTextWnd("enemy_health:name", self.enemyHP)
        self.enemyHPBarValue = xml:InitTextWnd("enemy_health:value", self.enemyHP)
        Log("Initializing level_bar")
        self.playerLevelBar = xml:InitStatic(
            "level_bar",
            cs:wnd()
        )
        self.playerLevelBar:Show(true)
        xml:InitStatic("level_bar:progress_background", self.playerLevelBar)
        self.playerLevelBarProgress = xml:InitProgressBar("level_bar:progress", self.playerLevelBar)
        self.playerLevelBarLevel = xml:InitTextWnd("level_bar:level", self.playerLevelBar)
        self.playerLevelBarXP = xml:InitTextWnd("level_bar:xp", self.playerLevelBar)
        return true
    end
    return false
end
function MonsterWorldUI.prototype.UpdateTarget(self)
    local targetObj = level.get_target_obj()
    if not targetObj then
        self:HideEnemyHealthUI()
        return
    end
    local targetDist = level.get_target_dist()
    local monster = self.world:GetMonster(targetObj:id())
    if targetDist < 300 and monster and monster.HP > 0 then
        self:ShowEnemyHealthUI(monster)
    else
        local ____self_HideEnemyHealthUI_16 = self.HideEnemyHealthUI
        local ____monster_IsDead_14 = monster
        if ____monster_IsDead_14 ~= nil then
            ____monster_IsDead_14 = ____monster_IsDead_14.IsDead
        end
        ____self_HideEnemyHealthUI_16(self, ____monster_IsDead_14 or false)
    end
end
function MonsterWorldUI.prototype.HideEnemyHealthUI(self, force)
    if force == nil then
        force = false
    end
    if force or time_global() - self.lastEnemyHpShowTime > 500 then
        local ____table_enemyHP_Show_result_17 = self.enemyHP
        if ____table_enemyHP_Show_result_17 ~= nil then
            ____table_enemyHP_Show_result_17 = ____table_enemyHP_Show_result_17:Show(false)
        end
    end
end
function MonsterWorldUI.prototype.ShowEnemyHealthUI(self, monster)
    if not self.enemyHP then
        return
    end
    self.lastEnemyHpShowTime = time_global()
    self.enemyHP:Show(true)
    self.enemyHPBarProgress:SetProgressPos(monster.HP / monster.MaxHP * 100)
    self.enemyHPBarName:SetText(monster.Name)
    self.enemyHPBarName:SetTextColor(cfg.MonsterRankColors[monster.Rank])
    self.enemyHPBarValue:SetText((tostring(math.floor(monster.HP)) .. " / ") .. tostring(math.floor(monster.MaxHP)))
end
function MonsterWorldUI.prototype.UpdateDamageNumbers(self)
    local now = time_global()
    do
        local i = 0
        while i < #self.damageNumbers do
            local entry = self.damageNumbers[i + 1]
            local text = entry.text
            if now - entry.showTime > 500 then
                text:Show(false)
            else
                local pos = text:GetWndPos()
                pos.y = pos.y - 2
                text:SetWndPos(pos)
            end
            i = i + 1
        end
    end
end
function MonsterWorldUI.prototype.UpdateXpRewardNumbers(self)
    local now = time_global()
    do
        local i = 0
        while i < #self.xpRewardNumbers do
            local entry = self.xpRewardNumbers[i + 1]
            local text = entry.text
            if now - entry.showTime > 1500 then
                text:Show(false)
            else
                local pos = text:GetWndPos()
                pos.y = pos.y - 1
                text:SetWndPos(pos)
            end
            i = i + 1
        end
    end
end
function MonsterWorldUI.prototype.UpdatePlayerLevelBar(self)
    local player = self.world.Player
    local levelInfo = "Level " .. tostring(player.Level)
    if player.StatPoints > 0 then
        levelInfo = levelInfo .. (" (SP: " .. tostring(player.StatPoints)) .. ")"
    end
    self.playerLevelBarLevel:SetText(levelInfo)
    local currentXP = player.CurrentXP
    local reqXP = player.RequeiredXP
    self.playerLevelBarXP:SetText((tostring(math.floor(currentXP)) .. " / ") .. tostring(math.floor(reqXP)))
    self.playerLevelBarProgress:SetProgressPos(clamp(currentXP / reqXP, 0, 1) * 100)
end
function MonsterWorldUI.prototype.PrepareUIItemStatsTable(self, oldPrepareStatsTable)
    local result = oldPrepareStatsTable() or utils_ui.stats_table
    local weaponStats = result.weapon
    local dpsConfig = {
        index = 1,
        name = "DPS",
        value_functor = function(obj, sec) return self:UIGetWeaponDPS(obj) end,
        typ = "float",
        icon_p = "",
        track = false,
        magnitude = 1,
        unit = "",
        compare = false,
        sign = false,
        show_always = true
    }
    weaponStats.dps = dpsConfig
    weaponStats.damage.index = 10
    weaponStats.damage.track = false
    weaponStats.damage.sign = false
    weaponStats.damage.magnitude = 1
    weaponStats.damage.icon_p = ""
    weaponStats.damage.value_functor = function(obj, sec) return self:UIGetWeaponDamagePerHit(obj) end
    weaponStats.fire_rate.index = 11
    weaponStats.fire_rate.track = false
    weaponStats.fire_rate.sign = false
    weaponStats.fire_rate.magnitude = 1
    weaponStats.fire_rate.unit = "RPM"
    weaponStats.fire_rate.icon_p = ""
    weaponStats.fire_rate.value_functor = function(obj, sec) return self:UIGetWeaponRPM(obj) end
    weaponStats.ammo_mag_size.index = 12
    weaponStats.ammo_mag_size.track = false
    weaponStats.ammo_mag_size.sign = false
    weaponStats.ammo_mag_size.magnitude = 1
    weaponStats.ammo_mag_size.icon_p = ""
    weaponStats.ammo_mag_size.value_functor = function(obj, sec) return self:UIGetWeaponAmmoMagSize(obj) end
    weaponStats.accuracy.index = 100
    weaponStats.accuracy.icon_p = ""
    weaponStats.handling.index = 101
    weaponStats.handling.icon_p = ""
    return result
end
function MonsterWorldUI.prototype.UIGetItemName(self, obj, current)
    if not IsWeapon(obj) then
        return current
    end
    local weapon = self.world:GetWeapon(obj:id())
    return (((cfg.Qualities[weapon.Quality] .. " ") .. current) .. " L.") .. tostring(weapon.Level)
end
function MonsterWorldUI.prototype.UIGetItemDescription(self, obj, current)
    if not IsWeapon(obj) then
        return current
    end
    return self.world:GetWeapon(obj:id()):GetBonusDescription()
end
function MonsterWorldUI.prototype.UIGetItemLevel(self, obj)
    return self.world:GetWeapon(obj:id()).Level
end
function MonsterWorldUI.prototype.UIGetWeaponDPS(self, obj)
    return self.world:GetWeapon(obj:id()).DamagePerHit * (1 / obj:cast_Weapon():RPM())
end
function MonsterWorldUI.prototype.UIGetWeaponDamagePerHit(self, obj)
    return self.world:GetWeapon(obj:id()).DamagePerHit
end
function MonsterWorldUI.prototype.UIGetWeaponRPM(self, obj)
    return 60 / obj:cast_Weapon():RPM()
end
function MonsterWorldUI.prototype.UIGetWeaponAmmoMagSize(self, obj)
    return obj:cast_Weapon():GetAmmoMagSize()
end
return ____exports
 end,
["MonsterWorldMod.MonsterWorld"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__StringEndsWith = ____lualib.__TS__StringEndsWith
local Map = ____lualib.Map
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
local ____basic = require("StalkerAPI.extensions.basic")
local IsPctRolled = ____basic.IsPctRolled
local Load = ____basic.Load
local RandomFromArray = ____basic.RandomFromArray
local Save = ____basic.Save
local CreateWorldPositionAtGO = ____basic.CreateWorldPositionAtGO
local cfg = require("MonsterWorldMod.MonsterWorldConfig")
local ____MWMonster = require("MonsterWorldMod.MWMonster")
local MWMonster = ____MWMonster.MWMonster
local ____MWPlayer = require("MonsterWorldMod.MWPlayer")
local MWPlayer = ____MWPlayer.MWPlayer
local ____MWWeapon = require("MonsterWorldMod.MWWeapon")
local MWWeapon = ____MWWeapon.MWWeapon
local ____MonsterWorldConfig = require("MonsterWorldMod.MonsterWorldConfig")
local MonsterRank = ____MonsterWorldConfig.MonsterRank
local ____MonsterWorldSpawns = require("MonsterWorldMod.MonsterWorldSpawns")
local MonsterWorldSpawns = ____MonsterWorldSpawns.MonsterWorldSpawns
local ____MonsterWorldUI = require("MonsterWorldMod.MonsterWorldUI")
local MonsterWorldUI = ____MonsterWorldUI.MonsterWorldUI
____exports.MonsterWorld = __TS__Class()
local MonsterWorld = ____exports.MonsterWorld
MonsterWorld.name = "MonsterWorld"
function MonsterWorld.prototype.____constructor(self, mod)
    self.mod = mod
    self.highlightedItems = {}
    self.monsters = {}
    self.weapons = {}
    self.SpawnManager = __TS__New(MonsterWorldSpawns, self)
    self.UIManager = __TS__New(MonsterWorldUI, self)
    utils_item.get_upgrades_tree = function(wpn, _t)
    end
    game_setup.try_spawn_world_item = function(ignore)
    end
    treasure_manager.init_settings = function()
    end
    treasure_manager.try_spawn_treasure = function(_ignore)
    end
    treasure_manager.create_random_stash = function(...)
    end
end
__TS__SetDescriptor(
    MonsterWorld.prototype,
    "Player",
    {get = function(self)
        if self.player == nil then
            self.player = __TS__New(MWPlayer, self, 0)
        end
        return self.player
    end},
    true
)
function MonsterWorld.prototype.GetMonster(self, monsterId)
    local ____temp_2 = not (self.monsters[monsterId] ~= nil)
    if ____temp_2 then
        local ____level_object_by_id_result_is_monster_result_0 = level.object_by_id(monsterId)
        if ____level_object_by_id_result_is_monster_result_0 ~= nil then
            ____level_object_by_id_result_is_monster_result_0 = ____level_object_by_id_result_is_monster_result_0:is_monster()
        end
        ____temp_2 = ____level_object_by_id_result_is_monster_result_0
    end
    if ____temp_2 then
        self.monsters[monsterId] = __TS__New(MWMonster, self, monsterId)
    end
    return self.monsters[monsterId]
end
function MonsterWorld.prototype.DestroyObject(self, id)
    self.monsters[id] = nil
    self.weapons[id] = nil
end
function MonsterWorld.prototype.GetWeapon(self, itemId)
    local ____temp_5 = not (self.weapons[itemId] ~= nil)
    if ____temp_5 then
        local ____level_object_by_id_result_is_weapon_result_3 = level.object_by_id(itemId)
        if ____level_object_by_id_result_is_weapon_result_3 ~= nil then
            ____level_object_by_id_result_is_weapon_result_3 = ____level_object_by_id_result_is_weapon_result_3:is_weapon()
        end
        ____temp_5 = ____level_object_by_id_result_is_weapon_result_3
    end
    if ____temp_5 then
        self.weapons[itemId] = __TS__New(MWWeapon, self, itemId)
    end
    return self.weapons[itemId]
end
function MonsterWorld.prototype.OnTakeItem(self, item)
    self:GetWeapon(item:id())
    if self.highlightedItems[item:id()] ~= nil then
        item:stop_particles(
            Load(
                item:id(),
                "MW_DropHighlight"
            ),
            Load(
                item:id(),
                "MW_DropHighlightBone"
            )
        )
        self.highlightedItems[item:id()] = nil
    end
end
function MonsterWorld.prototype.OnWeaponFired(self, wpn, ammo_elapsed)
    local weapon = self:GetWeapon(wpn:id())
    if weapon ~= nil and __TS__StringEndsWith(weapon.Section, "_mw") and weapon.GO:get_ammo_total() < 500 then
        local ammo = ini_sys:r_sec_ex(weapon.Section, "ammo_class")
        alife_create_item(ammo, self.Player.GO, {ammo = 1})
    end
end
function MonsterWorld.prototype.OnPlayerSpawned(self)
end
function MonsterWorld.prototype.Save(self, data)
    self.SpawnManager:Save(data)
    self.UIManager:Save(data)
end
function MonsterWorld.prototype.Load(self, data)
    self.SpawnManager:Load(data)
    self.UIManager:Load(data)
end
function MonsterWorld.prototype.Update(self)
    self.UIManager:Update()
end
function MonsterWorld.prototype.OnPlayerHit(self, attackerGO)
    if not attackerGO:is_monster() or not attackerGO:is_stalker() then
        return
    end
    local monster = self:GetMonster(attackerGO:id())
    if monster == nil then
        return
    end
    local ____self_Player_6, ____HP_7 = self.Player, "HP"
    ____self_Player_6[____HP_7] = ____self_Player_6[____HP_7] - monster.Damage
end
function MonsterWorld.prototype.OnMonstersHit(self, monsterHitsThisFrame)
    local hitsByWeapon = __TS__New(Map)
    for ____, ____value in __TS__Iterator(monsterHitsThisFrame) do
        local _ = ____value[1]
        local hitInfo = ____value[2]
        local hits = hitsByWeapon:get(hitInfo.weapon) or ({})
        hits[#hits + 1] = {hitInfo.monster, hitInfo.isCrit}
        hitsByWeapon:set(hitInfo.weapon, hits)
    end
    for ____, ____value in __TS__Iterator(hitsByWeapon) do
        local weapon = ____value[1]
        local hits = ____value[2]
        local weaponDamage = weapon.DamagePerHit / #hits
        do
            local i = 0
            while i < #hits do
                local monster, isCrit = unpack(hits[i + 1])
                local monsterDamage = weaponDamage
                if isCrit then
                    monsterDamage = monsterDamage * 2.5
                end
                local realDamage = math.min(monster.HP, monsterDamage)
                monster.HP = monster.HP - realDamage
                self.UIManager:ShowDamage(realDamage, isCrit, monster.IsDead)
                i = i + 1
            end
        end
    end
end
function MonsterWorld.prototype.OnMonsterKilled(self, monsterGO)
    local monster = self:GetMonster(monsterGO:id())
    if monster == nil then
        return
    end
    self.UIManager:ShowXPReward(monster.XPReward)
    local ____self_Player_8, ____CurrentXP_9 = self.Player, "CurrentXP"
    ____self_Player_8[____CurrentXP_9] = ____self_Player_8[____CurrentXP_9] + monster.XPReward
    if IsPctRolled(monster.DropChance) then
        self:GenerateDrop(monster)
    end
end
function MonsterWorld.prototype.GenerateDrop(self, monster)
    local typedSections = ini_sys:r_list("mw_drops_by_weapon_type", "sections")
    local selectedTypeSection = RandomFromArray(typedSections)
    local weaponCount = ini_sys:line_count(selectedTypeSection)
    local _, weaponBaseSection = ini_sys:r_line_ex(
        selectedTypeSection,
        math.random(0, weaponCount - 1)
    )
    local weaponVariants = ini_sys:r_list(weaponBaseSection, "variants")
    local selectedVariant = RandomFromArray(weaponVariants)
    local dropLevel = monster.Level
    if IsPctRolled(cfg.HigherLevelDropChancePct) then
        dropLevel = dropLevel + 1
    end
    local qualityLevel = 1
    do
        local i = 0
        while i < #cfg.QualityDropChance do
            if IsPctRolled(cfg.QualityDropChance[i + 1][1]) then
                qualityLevel = cfg.QualityDropChance[i + 1][2]
                break
            end
            i = i + 1
        end
    end
    if monster.Rank == MonsterRank.Elite then
        if IsPctRolled(cfg.EnemyEliteDropLevelIncreaseChance) then
            dropLevel = dropLevel + 1
        end
        if IsPctRolled(cfg.EnemyEliteDropQualityIncreaseChance) then
            qualityLevel = qualityLevel + 1
        end
    elseif monster.Rank == MonsterRank.Boss then
        if IsPctRolled(cfg.EnemyBossDropLevelIncreaseChance) then
            dropLevel = dropLevel + 1
        end
        if IsPctRolled(cfg.EnemyBossDropQualityIncreaseChance) then
            qualityLevel = qualityLevel + 1
        end
    end
    local sgo = alife_create_item(
        selectedVariant,
        CreateWorldPositionAtGO(monster.GO)
    )
    Save(sgo.id, "MW_SpawnParams", {level = dropLevel, quality = qualityLevel})
    Save(sgo.id, "MW_DropHighlight", cfg.ParticlesByQuality[qualityLevel])
    Save(sgo.id, "MW_DropHighlightBone", "wpn_body")
    CreateTimeEvent(
        sgo:name() .. "_add_highlight",
        sgo:name(),
        0.1,
        function(objId)
            local go = level.object_by_id(objId)
            if go == nil then
                return false
            end
            local particles = Load(objId, "MW_DropHighlight")
            if particles ~= nil then
                self.highlightedItems[go:id()] = true
                go:start_particles(
                    particles,
                    Load(objId, "MW_DropHighlightBone")
                )
            end
            return true
        end,
        sgo.id
    )
end
return ____exports
 end,
["MonsterWorldMod.BaseMWObject"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____basic = require("StalkerAPI.extensions.basic")
local Load = ____basic.Load
local Save = ____basic.Save
____exports.BaseMWObject = __TS__Class()
local BaseMWObject = ____exports.BaseMWObject
BaseMWObject.name = "BaseMWObject"
function BaseMWObject.prototype.____constructor(self, mw, id)
    self.mw = mw
    self.id = id
    if not self.Initialized then
        self:Initialize()
        self.Initialized = true
    end
end
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "Initialized",
    {
        get = function(self)
            return self:Load("Initialized")
        end,
        set = function(self, initialized)
            self:Save("Initialized", initialized)
        end
    },
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "ServerGO",
    {get = function(self)
        return alife():object(self.id)
    end},
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "GO",
    {get = function(self)
        return level.object_by_id(self.id)
    end},
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "SectionId",
    {get = function(self)
        return (self.ServerGO:section_name() .. ":") .. tostring(self.ServerGO.id)
    end},
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "HP",
    {
        get = function(self)
            return self:Load("HP")
        end,
        set = function(self, newHp)
            newHp = math.floor(newHp)
            self:Save("HP", newHp)
            if self.GO ~= nil then
                self.GO:set_health_ex(newHp / self.MaxHP)
            end
            if self.IsDead then
                self:OnDeath()
            end
        end
    },
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "MaxHP",
    {
        get = function(self)
            return self:Load("MaxHP")
        end,
        set = function(self, newMaxHp)
            newMaxHp = math.floor(newMaxHp)
            self:Save("MaxHP", newMaxHp)
            self.HP = newMaxHp
        end
    },
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "Level",
    {
        get = function(self)
            return self:Load("Level")
        end,
        set = function(self, level)
            self:Save("Level", level)
        end
    },
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "IsDead",
    {get = function(self)
        return self.HP <= 0
    end},
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "Section",
    {get = function(self)
        return self.ServerGO:section_name()
    end},
    true
)
function BaseMWObject.prototype.Save(self, varname, val)
    Save(self.id, "MW_" .. varname, val)
end
function BaseMWObject.prototype.Load(self, varname, def)
    return Load(self.id, "MW_" .. varname, def)
end
function BaseMWObject.prototype.OnDeath(self)
end
return ____exports
 end,
["StalkerAPI.scripts.db.t"] = function(...) 
 end,
["StalkerAPI.types.cai.t"] = function(...) 
 end,
}
return require("MonsterWorldMod.MonsterWorldMod", ...)
