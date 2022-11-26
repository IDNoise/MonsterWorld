
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
    self.lastFrameTime = 0
end
function StalkerModBase.prototype.OnBeforeLevelChanging(self)
end
function StalkerModBase.prototype.OnLevelChanging(self)
end
function StalkerModBase.prototype.OnActorNetDestroy(self)
end
function StalkerModBase.prototype.OnActorFirstUpdate(self)
end
function StalkerModBase.prototype.OnActorUpdate(self)
    local time = time_global()
    local deltaTime = (time - self.lastFrameTime) / 1000
    self:OnUpdate(deltaTime)
    self.lastFrameTime = time
end
function StalkerModBase.prototype.OnUpdate(self, deltaTime)
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
end
function StalkerModBase.prototype.OnSmartTerrainTryRespawn(self, smart)
    return true
end
function StalkerModBase.prototype.OnServerEntityRegister(self, serverObject, ____type)
end
function StalkerModBase.prototype.OnServerEntityUnregister(self, serverObject, ____type)
end
function StalkerModBase.prototype.OnSaveState(self, data)
end
function StalkerModBase.prototype.OnLoadState(self, data)
end
function StalkerModBase.prototype.OnItemNetSpawn(self, item, serverObject)
end
function StalkerModBase.prototype.OnItemTake(self, item)
end
function StalkerModBase.prototype.OnItemDrop(self, item)
end
function StalkerModBase.prototype.OnItemUse(self, item)
end
function StalkerModBase.prototype.OnWeaponFired(self, obj, wpn, ammo_elapsed)
end
function StalkerModBase.prototype.OnItemFocusReceive(self, item)
end
function StalkerModBase.prototype.OnHudAnimationPlay(self, obj, anim_table)
end
function StalkerModBase.prototype.OnHudAnimationEnd(self, item, section, motion, state, slot)
end
function StalkerModBase.prototype.OnKeyRelease(self, key)
end
function StalkerModBase.prototype.OnKeyHold(self, key)
end
function StalkerModBase.prototype.OnBeforeKeyPress(self, key, bind, dis)
    return true
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
        "actor_on_before_death",
        function(...) return self:OnActorUpdate() end
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
        "actor_on_item_use",
        function(item, sec) return self:OnItemUse(item) end
    )
    RegisterScriptCallback(
        "actor_on_weapon_fired",
        function(obj, wpn, ammo_elapsed, grenade_elapsed, ammo_type, grenade_type) return self:OnWeaponFired(obj, wpn, ammo_elapsed) end
    )
    RegisterScriptCallback(
        "actor_on_hud_animation_play",
        function(anim_table, item) return self:OnHudAnimationPlay(item, anim_table) end
    )
    RegisterScriptCallback(
        "actor_on_hud_animation_end",
        function(item, section, motion, state, slot) return self:OnHudAnimationEnd(
            item,
            section,
            motion,
            state,
            slot
        ) end
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
        "on_key_release",
        function(key) return self:OnKeyRelease(key) end
    )
    RegisterScriptCallback(
        "on_key_hold",
        function(key) return self:OnKeyHold(key) end
    )
    RegisterScriptCallback(
        "on_before_key_press",
        function(key, bind, dis, flags)
            flags.ret_value = self:OnBeforeKeyPress(key, bind, dis)
        end
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
    bind_item.item_binder.net_spawn = function(s, serverGO)
        local result = oldItemNetSpawn(s, serverGO)
        if result then
            self:OnItemNetSpawn(s.object, serverGO)
        end
        return result
    end
end
StalkerModBase.ModName = "StarlkerModBase"
StalkerModBase.IsLogEnabled = true
return ____exports
 end,
["MonsterWorldMod.Configs.Constants"] = function(...) 
local ____exports = {}
____exports.PlayerHPBase = 100
____exports.PlayerHPPerLevel = 10
____exports.PlayerHPRegenBase = 0.2
____exports.PlayerHPRegenPctPerLevel = 10
____exports.PlayerRunSpeedPctPerLevel = 2
____exports.PlayerDefaultCritDamagePct = 250
____exports.PlayerRunSpeedCoeff = 2.4
____exports.PlayerRunBackSpeedCoeff = 1.4
____exports.PlayerSprintSpeedCoeff = 2.1
____exports.PlayerXPForFirstLevel = 250
____exports.PlayerXPExp = 1.3
____exports.PlayerXPPct = 100
____exports.SkillPointsPerLevelUp = 5
____exports.EnemyHPBase = 50
____exports.EnemyHPExpPerLevel = 1.15
____exports.EnemyHPPctPerLevel = 75
____exports.EnemyHpDeltaPct = 10
____exports.EnemyDamageBase = ____exports.PlayerHPBase / 25
____exports.EnemyDamageExpPerLevel = 1.025
____exports.EnemyDamagePctPerLevel = 10
____exports.EnemyXpRewardBase = ____exports.PlayerXPForFirstLevel / 20
____exports.EnemyXpRewardExpPerLevel = 1.25
____exports.EnemyXpRewardPctPerLevel = 50
____exports.EnemyHigherLevelChance = 5
____exports.EnemyEliteChance = 12
____exports.EnemyBossChance = 3
____exports.EnemyHpMultsByRank = {1, 3, 10}
____exports.EnemyXpMultsByRank = {1, 3, 10}
____exports.EnemyDamageMultsByRank = {1, 1.5, 3}
____exports.EnemyDropLevelIncreaseChanceByRank = {1, 20, 50}
____exports.EnemyDropQualityIncreaseChanceByRank = {1, 20, 50}
____exports.WeaponDPSBase = ____exports.EnemyHPBase / 0.5
____exports.WeaponDPSExpPerLevel = ____exports.EnemyHPExpPerLevel - 0.005
____exports.WeaponDPSPctPerQuality = 10
return ____exports
 end,
["MonsterWorldMod.Skills.Skill"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
____exports.Skill = __TS__Class()
local Skill = ____exports.Skill
Skill.name = "Skill"
function Skill.prototype.____constructor(self, Id, Owner, PriceFormula, MaxLevel)
    if MaxLevel == nil then
        MaxLevel = -1
    end
    self.Id = Id
    self.Owner = Owner
    self.PriceFormula = PriceFormula
    self.MaxLevel = MaxLevel
    self.level = 0
    self.OnLevelUpHandlers = {}
end
__TS__SetDescriptor(
    Skill.prototype,
    "Level",
    {
        get = function(self)
            return self.level
        end,
        set = function(self, level)
            local oldLevel = self.Level
            self.level = level
            if level > oldLevel then
                self:OnLevelUp(oldLevel, level)
            end
            self.Owner:SetSkillLevel(self.Id, self.Level)
        end
    },
    true
)
__TS__SetDescriptor(
    Skill.prototype,
    "CanBeUpgraded",
    {get = function(self)
        return not self.IsMaxLevelReached and self.PlayerHasMoney
    end},
    true
)
__TS__SetDescriptor(
    Skill.prototype,
    "PlayerHasMoney",
    {get = function(self)
        return self.UpgradePrice <= MonsterWorld.Player.SkillPoints
    end},
    true
)
__TS__SetDescriptor(
    Skill.prototype,
    "IsMaxLevelReached",
    {get = function(self)
        return self.MaxLevel ~= -1 and self.Level >= self.MaxLevel
    end},
    true
)
__TS__SetDescriptor(
    Skill.prototype,
    "Description",
    {get = function(self)
    end},
    true
)
__TS__SetDescriptor(
    Skill.prototype,
    "UpgradePrice",
    {get = function(self)
        return self.PriceFormula ~= nil and self.PriceFormula(self.Level + 1) or 0
    end},
    true
)
function Skill.prototype.Init(self)
    self.level = self.Owner:GetSkillLevel(self.Id)
    self:UpdateLevelBonuses()
end
function Skill.prototype.Upgrade(self)
    if not self.CanBeUpgraded then
        return
    end
    local player = MonsterWorld.Player
    local price = self.UpgradePrice
    if player.SkillPoints >= price then
        player.SkillPoints = player.SkillPoints - price
        self.Level = self.Level + 1
    end
end
function Skill.prototype.OnLevelUp(self, oldLevel, newLevel)
    self:UpdateUI()
    self:UpdateLevelBonuses()
end
function Skill.prototype.UpdateLevelBonuses(self)
end
function Skill.prototype.UpdateUI(self)
    local ____table_DescriptionText_SetText_result_0 = self.DescriptionText
    if ____table_DescriptionText_SetText_result_0 ~= nil then
        ____table_DescriptionText_SetText_result_0 = ____table_DescriptionText_SetText_result_0:SetText(self.Description)
    end
    local ____table_LevelText_SetText_result_2 = self.LevelText
    if ____table_LevelText_SetText_result_2 ~= nil then
        ____table_LevelText_SetText_result_2 = ____table_LevelText_SetText_result_2:SetText("L. " .. tostring(self.Level))
    end
    self:UpdateUpgradeButton()
end
function Skill.prototype.UpdateUpgradeButton(self)
    local ____table_UpgradeButton_Enable_result_4 = self.UpgradeButton
    if ____table_UpgradeButton_Enable_result_4 ~= nil then
        ____table_UpgradeButton_Enable_result_4 = ____table_UpgradeButton_Enable_result_4:Enable(self.CanBeUpgraded)
    end
    local ____table_UpgradeButton_TextControl_result_SetText_result_6 = self.UpgradeButton
    if ____table_UpgradeButton_TextControl_result_SetText_result_6 ~= nil then
        ____table_UpgradeButton_TextControl_result_SetText_result_6 = ____table_UpgradeButton_TextControl_result_SetText_result_6:TextControl():SetText(not self.IsMaxLevelReached and tostring(self.UpgradePrice) .. " SP" or "MAX")
    end
end
function Skill.prototype.Update(self, deltaTime)
end
function Skill.prototype.OnMonsterHit(self, monster, isCrit)
end
function Skill.prototype.OnMonsterKill(self, monster, isCrit)
end
function ____exports.PriceFormulaConstant(price)
    return function(_level) return price end
end
function ____exports.PriceFormulaLevel()
    return function(level) return level end
end
return ____exports
 end,
["MonsterWorldMod.Configs.Stats"] = function(...) 
local ____exports = {}
____exports.PctStats = {
    6,
    7,
    8,
    9,
    5
}
____exports.StatTitles = {
    [0] = "Run Speed",
    [1] = "Sprint Speed",
    [2] = "Max HP",
    [3] = "HP Regen",
    [4] = "Damage per Hit",
    [5] = "Reload Speed",
    [6] = "Crit Damage",
    [7] = "Crit Chance",
    [8] = "Damage to Stalkers",
    [9] = "Damage to Mutants",
    [10] = "Ammo"
}
return ____exports
 end,
["MonsterWorldMod.Helpers.StalkerAPI"] = function(...) 
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
function ____exports.NumberToCondList(value)
    return xr_logic.parse_condlist(
        nil,
        nil,
        nil,
        tostring(value)
    )
end
function ____exports.GetId(objOrId)
    if type(objOrId) == "number" then
        return objOrId
    end
    if type(objOrId.id) == "number" then
        return objOrId.id
    end
    return objOrId:id()
end
return ____exports
 end,
["MonsterWorldMod.GameObjects.BaseMWObject"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
local GetStatBonusField, GetStatBaseField, GetStatTotalField
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local ____Stats = require("MonsterWorldMod.Configs.Stats")
local PctStats = ____Stats.PctStats
local ____StalkerAPI = require("MonsterWorldMod.Helpers.StalkerAPI")
local Save = ____StalkerAPI.Save
local Load = ____StalkerAPI.Load
function GetStatBonusField(stat, bonusType)
    return ((tostring(stat) .. "_") .. tostring(bonusType)) .. "_bonuses"
end
function GetStatBaseField(stat)
    return tostring(stat) .. "_base"
end
function GetStatTotalField(stat)
    return tostring(stat) .. "_total"
end
____exports.BaseMWObject = __TS__Class()
local BaseMWObject = ____exports.BaseMWObject
BaseMWObject.name = "BaseMWObject"
function BaseMWObject.prototype.____constructor(self, id)
    self.id = id
    self.Skills = __TS__New(Map)
end
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
            newHp = math.max(
                0,
                math.min(newHp, self.MaxHP)
            )
            self:Save("HP", newHp)
            if self.GO ~= nil and newHp <= 0 then
                self.GO:set_health_ex(newHp)
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
    {get = function(self)
        return math.max(
            1,
            self:GetStat(2)
        )
    end},
    true
)
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "HPRegen",
    {get = function(self)
        return self:GetStat(3)
    end},
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
__TS__SetDescriptor(
    BaseMWObject.prototype,
    "WasInitializedForFirstTime",
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
function BaseMWObject.prototype.Initialize(self)
    if not self.WasInitializedForFirstTime then
        self:OnFirstTimeInitialize()
        self.WasInitializedForFirstTime = true
    end
    self:OnInitialize()
end
function BaseMWObject.prototype.Update(self, deltaTime)
    self:RegenHP(deltaTime)
end
function BaseMWObject.prototype.RegenHP(self, deltaTime)
    self.HP = math.min(self.MaxHP, self.HP + self.HPRegen * deltaTime)
end
function BaseMWObject.prototype.GetStat(self, stat)
    return self:Load(
        GetStatTotalField(stat),
        0
    )
end
function BaseMWObject.prototype.SetStatBase(self, stat, baseValue)
    self:Save(
        GetStatBaseField(stat),
        baseValue
    )
    self:RecalculateStatTotal(stat)
end
function BaseMWObject.prototype.AddStatBonus(self, stat, bonusType, bonus, source)
    if __TS__ArrayIncludes(PctStats, stat) and bonusType ~= 0 then
        Log((("ERROR: Adding non flat bonus to % stat: " .. tostring(stat)) .. " from ") .. source)
        return
    end
    local field = GetStatBonusField(stat, bonusType)
    local bonuses = self:Load(field, {})
    bonuses[source] = bonus
    self:Save(field, bonuses)
    self:RecalculateStatTotal(stat)
end
function BaseMWObject.prototype.RemoveStatBonus(self, stat, bonusType, source)
    local field = GetStatBonusField(stat, bonusType)
    local bonuses = self:Load(field, {})
    bonuses[source] = nil
    self:Save(field, bonuses)
    self:RecalculateStatTotal(stat)
end
function BaseMWObject.prototype.RecalculateStatTotal(self, stat)
    local base = self:Load(
        GetStatBaseField(stat),
        0
    )
    local flatBonuses = self:Load(
        GetStatBonusField(stat, 0),
        {}
    )
    local flatBonus = 0
    for _, value in pairs(flatBonuses) do
        flatBonus = flatBonus + value
    end
    local pctBonuses = self:Load(
        GetStatBonusField(stat, 1),
        {}
    )
    local pctBonus = 0
    for _, value in pairs(pctBonuses) do
        pctBonus = pctBonus + value
    end
    local multBonuses = self:Load(
        GetStatBonusField(stat, 2),
        {}
    )
    local multBonus = 1
    for _, value in pairs(multBonuses) do
        multBonus = multBonus * value
    end
    local total = (base + flatBonus) * (1 + pctBonus / 100) * multBonus
    self:Save(
        GetStatTotalField(stat),
        total
    )
    self:OnStatChanged(stat, total)
end
function BaseMWObject.prototype.OnStatChanged(self, stat, total)
    if stat == 2 then
        self.HP = total
    end
end
function BaseMWObject.prototype.SetSkillLevel(self, skillId, level)
    self:Save("SkillLevel_" .. skillId, level)
end
function BaseMWObject.prototype.GetSkillLevel(self, skillId)
    return self:Load("SkillLevel_" .. skillId, 0)
end
function BaseMWObject.prototype.SetupSkills(self)
end
function BaseMWObject.prototype.AddSkill(self, skill)
    skill:Init()
    self.Skills:set(skill.Id, skill)
end
function BaseMWObject.prototype.IterateSkills(self, iterator, onlyWithLevel)
    if onlyWithLevel == nil then
        onlyWithLevel = true
    end
    for ____, ____value in __TS__Iterator(self.Skills) do
        local _ = ____value[1]
        local skill = ____value[2]
        if not onlyWithLevel or skill.Level > 0 then
            iterator(skill)
        end
    end
end
function BaseMWObject.prototype.Save(self, varname, val)
    Save(self.id, "MW_" .. varname, val)
end
function BaseMWObject.prototype.Load(self, varname, def)
    return Load(self.id, "MW_" .. varname, def)
end
function BaseMWObject.prototype.OnFirstTimeInitialize(self)
end
function BaseMWObject.prototype.OnInitialize(self)
    self:SetupSkills()
end
function BaseMWObject.prototype.OnDeath(self)
end
return ____exports
 end,
["MonsterWorldMod.Helpers.Collections"] = function(...) 
local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local ____exports = {}
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
function ____exports.TakeRandomElementFromArray(array)
    local index = math.random(0, #array - 1)
    local element = array[index + 1]
    __TS__ArraySplice(array, index, 1)
    return element
end
function ____exports.TakeRandomUniqueElementsFromArray(array, count)
    local result = {}
    count = math.min(count, #array)
    do
        local i = 0
        while i < count do
            result[#result + 1] = ____exports.TakeRandomElementFromArray(array)
            i = i + 1
        end
    end
    return result
end
function ____exports.GetByWeightFromArray(array, weightGetter)
    local totalWeight = 0
    for ____, element in ipairs(array) do
        totalWeight = totalWeight + weightGetter(element)
    end
    local randValue = math.random(1, totalWeight)
    local weightStartCheck = 0
    for ____, element in ipairs(array) do
        weightStartCheck = weightStartCheck + weightGetter(element)
        if randValue <= weightStartCheck then
            return element
        end
    end
    return array[1]
end
function ____exports.GetByWeightFromTable(tbl, weightGetter)
    local totalWeight = 0
    local keys = {}
    for k, v in pairs(tbl) do
        keys[#keys + 1] = k
        totalWeight = totalWeight + weightGetter(v)
    end
    local randValue = math.random(1, totalWeight)
    local weightStartCheck = 0
    local first = nil
    for k, v in pairs(tbl) do
        weightStartCheck = weightStartCheck + weightGetter(v)
        if randValue <= weightStartCheck then
            return k
        end
    end
    return keys[1]
end
return ____exports
 end,
["MonsterWorldMod.Configs.Levels"] = function(...) 
local ____exports = {}
local level = 1
local ____level_0 = level
level = ____level_0 + 1
local ____temp_33 = {level = ____level_0, type = 1}
local ____level_1 = level
level = ____level_1 + 1
local ____temp_34 = {level = ____level_1, type = 1}
local ____level_2 = level
level = ____level_2 + 1
local ____temp_35 = {level = ____level_2, type = 1}
local ____level_3 = level
level = ____level_3 + 1
local ____temp_36 = {level = ____level_3, type = 1}
local ____level_4 = level
level = ____level_4 + 1
local ____temp_37 = {level = ____level_4, type = 1}
local ____level_5 = level
level = ____level_5 + 1
local ____temp_38 = {level = ____level_5, type = 1}
local ____level_6 = level
level = ____level_6 + 1
local ____temp_39 = {level = ____level_6, type = 1}
local ____level_7 = level
level = ____level_7 + 1
local ____temp_40 = {level = ____level_7, type = 1}
local ____level_8 = level
level = ____level_8 + 1
local ____temp_41 = {level = ____level_8, type = 1}
local ____level_9 = level
level = ____level_9 + 1
local ____temp_42 = {level = ____level_9, type = 1}
local ____level_10 = level
level = ____level_10 + 1
local ____temp_43 = {level = ____level_10, type = 1}
local ____level_11 = level
level = ____level_11 + 1
local ____temp_44 = {level = ____level_11, type = 1}
local ____level_12 = level
level = ____level_12 + 1
local ____temp_45 = {level = ____level_12, type = 1}
local ____level_13 = level
level = ____level_13 + 1
local ____temp_46 = {level = ____level_13, type = 1}
local ____level_14 = level
level = ____level_14 + 1
local ____temp_47 = {level = ____level_14, type = 1}
local ____level_15 = level
level = ____level_15 + 1
local ____temp_48 = {level = ____level_15, type = 1}
local ____level_16 = level
level = ____level_16 + 1
local ____temp_49 = {level = ____level_16, type = 1}
local ____level_17 = level
level = ____level_17 + 1
local ____temp_50 = {level = ____level_17, type = 1}
local ____level_18 = level
level = ____level_18 + 1
local ____temp_51 = {level = ____level_18, type = 1}
local ____level_19 = level
level = ____level_19 + 1
local ____temp_52 = {level = ____level_19, type = 1}
local ____level_20 = level
level = ____level_20 + 1
local ____temp_53 = {level = ____level_20, type = 1}
local ____level_21 = level
level = ____level_21 + 1
local ____temp_54 = {level = ____level_21, type = 1}
local ____level_22 = level
level = ____level_22 + 1
local ____temp_55 = {level = ____level_22, type = 1}
local ____level_23 = level
level = ____level_23 + 1
local ____temp_56 = {type = 2, level = ____level_23}
local ____level_24 = level
level = ____level_24 + 1
local ____temp_57 = {type = 2, level = ____level_24}
local ____level_25 = level
level = ____level_25 + 1
local ____temp_58 = {type = 2, level = ____level_25}
local ____level_26 = level
level = ____level_26 + 1
local ____temp_59 = {type = 2, level = ____level_26}
local ____level_27 = level
level = ____level_27 + 1
local ____temp_60 = {type = 2, level = ____level_27}
local ____level_28 = level
level = ____level_28 + 1
local ____temp_61 = {type = 2, level = ____level_28}
local ____level_29 = level
level = ____level_29 + 1
local ____temp_62 = {type = 4, level = ____level_29}
local ____level_30 = level
level = ____level_30 + 1
local ____temp_63 = {type = 4, level = ____level_30}
local ____level_31 = level
level = ____level_31 + 1
local ____temp_64 = {type = 4, level = ____level_31}
local ____level_32 = level
level = ____level_32 + 1
____exports.LocationConfigs = {
    l01_escape = ____temp_33,
    l02_garbage = ____temp_34,
    k00_marsh = ____temp_35,
    l03_agroprom = ____temp_36,
    l04_darkvalley = ____temp_37,
    k01_darkscape = ____temp_38,
    l05_bar = ____temp_39,
    l06_rostok = ____temp_40,
    l08_yantar = ____temp_41,
    l07_military = ____temp_42,
    k02_trucks_cemetery = ____temp_43,
    l09_deadcity = ____temp_44,
    l10_limansk = ____temp_45,
    l10_radar = ____temp_46,
    l10_red_forest = ____temp_47,
    pripyat = ____temp_48,
    l11_pripyat = ____temp_49,
    l12_stancia = ____temp_50,
    l12_stancia_2 = ____temp_51,
    l13_generators = ____temp_52,
    y04_pole = ____temp_53,
    jupiter = ____temp_54,
    zaton = ____temp_55,
    l03u_agr_underground = ____temp_56,
    l10u_bunker = ____temp_57,
    l11_hospital = ____temp_58,
    jupiter_underground = ____temp_59,
    l12u_control_monolith = ____temp_60,
    l12u_sarcofag = ____temp_61,
    l04u_labx18 = ____temp_62,
    l08u_brainlab = ____temp_63,
    l13u_warlab = ____temp_64,
    labx8 = {type = 4, level = ____level_32}
}
return ____exports
 end,
["MonsterWorldMod.Configs.Enemies"] = function(...) 
local ____exports = {}
____exports.MonsterConfigs = {}
____exports.MonsterConfigs.Bandit = {
    type = "Bandit",
    level_start = 1,
    level_end = 8,
    level_type = 3,
    hp_mult = 1.5,
    xp_mult = 1.1,
    damage_mult = 1.25,
    squad_size_min = 8,
    squad_size_max = 16,
    common_section = "sim_default_bandit_2",
    elite_section = "sim_default_bandit_3",
    boss_section = "sim_default_bandit_4"
}
____exports.MonsterConfigs.Flesh = {
    type = "Flesh",
    level_start = 1,
    level_end = 3,
    level_type = 1,
    hp_mult = 1.4,
    xp_mult = 1.2,
    squad_size_min = 5,
    squad_size_max = 10,
    common_section = "flesh_01a_weak",
    elite_section = "flesh_02a_normal",
    boss_section = "flesh_bolot"
}
____exports.MonsterConfigs.Dog = {
    type = "Dog",
    level_type = 1,
    level_start = 1,
    level_end = 7,
    hp_mult = 0.5,
    xp_mult = 0.4,
    squad_size_min = 6,
    squad_size_max = 12,
    common_section = "dog_weak_white",
    elite_section = "dog_strong_red",
    boss_section = "dog_strong_black"
}
____exports.MonsterConfigs.Boar = {
    type = "Boar",
    level_type = 1,
    level_start = 2,
    level_end = 9,
    hp_mult = 1.25,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "boar_01a_weak",
    elite_section = "boar_02a_strong",
    boss_section = "boar_02a_hard"
}
____exports.MonsterConfigs.Zombified = {
    type = "Zombified",
    level_type = 7,
    level_start = 2,
    hp_mult = 1.5,
    xp_mult = 1,
    damage_mult = 1.25,
    squad_size_min = 10,
    squad_size_max = 24,
    common_section = "sim_default_zombied_2",
    elite_section = "sim_default_zombied_3",
    boss_section = "sim_default_zombied_4"
}
____exports.MonsterConfigs.Cat = {
    type = "Cat",
    level_start = 3,
    level_end = 14,
    level_type = 1,
    hp_mult = 0.75,
    xp_mult = 0.75,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "cat_normal_d",
    elite_section = "cat_strong_b",
    boss_section = "cat_strong_afro"
}
____exports.MonsterConfigs.Army = {
    type = "Army",
    level_start = 4,
    level_type = 3,
    hp_mult = 1.75,
    xp_mult = 1.25,
    damage_mult = 1.5,
    squad_size_min = 8,
    squad_size_max = 16,
    common_section = "sim_default_military_1",
    elite_section = "sim_default_military_2",
    boss_section = "sim_default_military_3"
}
____exports.MonsterConfigs["Pseudo Dog"] = {
    type = "Pseudo Dog",
    level_start = 4,
    level_type = 7,
    hp_mult = 1.25,
    damage_mult = 1.25,
    xp_mult = 1.25,
    squad_size_min = 3,
    squad_size_max = 6,
    common_section = "pseudodog_weak",
    elite_section = "pseudodog_strong",
    boss_section = "pseudodog_arena"
}
____exports.MonsterConfigs.Snork = {
    type = "Snork",
    level_start = 5,
    level_type = 7,
    hp_mult = 1.5,
    xp_mult = 1.25,
    squad_size_min = 4,
    squad_size_max = 8,
    common_section = "snork_weak3",
    elite_section = "snork_strong2",
    boss_section = "snork_strong_no_mask"
}
____exports.MonsterConfigs.Lurker = {
    type = "Lurker",
    level_start = 5,
    level_type = 1,
    hp_mult = 1.25,
    damage_mult = 1.5,
    xp_mult = 1.35,
    squad_size_min = 3,
    squad_size_max = 8,
    common_section = "lurker_1_weak",
    elite_section = "lurker_2_normal",
    boss_section = "lurker_3_strong"
}
____exports.MonsterConfigs.Bloodsucker = {
    type = "Bloodsucker",
    level_start = 5,
    level_type = bit.bor(2, 4),
    hp_mult = 2.5,
    damage_mult = 1.5,
    xp_mult = 2,
    squad_size_min = 2,
    squad_size_max = 5,
    common_section = "bloodsucker_green_weak",
    elite_section = "bloodsucker_red_normal",
    boss_section = "bloodsucker_strong_big"
}
____exports.MonsterConfigs.Fracture = {
    type = "Fracture",
    level_start = 6,
    level_end = 16,
    level_type = 3,
    hp_mult = 1.75,
    xp_mult = 1.35,
    squad_size_min = 3,
    squad_size_max = 7,
    common_section = "fracture_weak",
    elite_section = "fracture_2",
    boss_section = "fracture_3"
}
____exports.MonsterConfigs.Burer = {
    type = "Burer",
    level_start = 7,
    level_type = bit.bor(4, 2),
    hp_mult = 2.5,
    xp_mult = 1.5,
    squad_size_min = 2,
    squad_size_max = 5,
    common_section = "burer_weak2",
    elite_section = "burer_normal",
    boss_section = "burer_blue_blue"
}
____exports.MonsterConfigs.Controller = {
    type = "Controller",
    level_start = 7,
    level_type = 4,
    hp_mult = 6,
    xp_mult = 3,
    squad_size_min = 1,
    squad_size_max = 3,
    max_squads_per_smart = 1,
    common_section = "m_controller_normal666",
    elite_section = "m_controller_normal777",
    boss_section = "m_controller_normal1111"
}
____exports.MonsterConfigs.Sin = {
    type = "Sin",
    level_start = 8,
    level_type = 3,
    hp_mult = 2.1,
    xp_mult = 1.5,
    damage_mult = 1.6,
    squad_size_min = 8,
    squad_size_max = 16,
    common_section = "sim_default_greh_2",
    elite_section = "sim_default_greh_3",
    boss_section = "sim_default_greh_4"
}
____exports.MonsterConfigs.Psysucker = {
    type = "Psysucker",
    level_start = 15,
    level_type = bit.bor(4, 2),
    hp_mult = 2,
    damage_mult = 1.25,
    xp_mult = 1.5,
    squad_size_min = 3,
    squad_size_max = 7,
    common_section = "psysucker_white",
    elite_section = "psysucker_brown",
    boss_section = "psysucker_black"
}
____exports.MonsterConfigs.Giant = {
    type = "Giant",
    level_start = 12,
    level_type = 1,
    hp_mult = 8,
    damage_mult = 2,
    xp_mult = 3,
    squad_size_min = 1,
    squad_size_max = 3,
    max_squads_per_smart = 1,
    common_section = "gigant_weak",
    elite_section = "gigant_normal",
    boss_section = "gigant_strong"
}
____exports.MonsterConfigs.Mercenary = {
    type = "Mercenary",
    level_start = 12,
    level_type = 3,
    hp_mult = 2.25,
    xp_mult = 1.5,
    damage_mult = 1.75,
    squad_size_min = 8,
    squad_size_max = 16,
    common_section = "sim_default_killer_2",
    elite_section = "sim_default_killer_3",
    boss_section = "sim_default_killer_4"
}
____exports.MonsterConfigs.Chimera = {
    type = "Chimera",
    level_start = 15,
    level_type = 1,
    hp_mult = 4,
    damage_mult = 3,
    xp_mult = 3,
    squad_size_min = 2,
    squad_size_max = 5,
    max_squads_per_smart = 1,
    common_section = "chimera_weak",
    elite_section = "chimera_strong",
    boss_section = "chimera_strong4"
}
____exports.MonsterConfigs.Monolith = {
    type = "Monolith",
    level_start = 15,
    level_type = 7,
    hp_mult = 2.5,
    xp_mult = 1.75,
    damage_mult = 2,
    squad_size_min = 10,
    squad_size_max = 20,
    common_section = "sim_default_monolith_2",
    elite_section = "sim_default_monolith_3",
    boss_section = "sim_monolith_sniper"
}
return ____exports
 end,
["MonsterWorldMod.Configs.UI"] = function(...) 
local ____exports = {}
____exports.Qualities = {
    [1] = "Common",
    [2] = "Uncommon",
    [3] = "Rare",
    [4] = "Epic",
    [5] = "Legendary"
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
return ____exports
 end,
["MonsterWorldMod.Configs.Loot"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__StringPadEnd = ____lualib.__TS__StringPadEnd
local ____exports = {}
local ____Collections = require("MonsterWorldMod.Helpers.Collections")
local GetByWeightFromArray = ____Collections.GetByWeightFromArray
local ____UI = require("MonsterWorldMod.Configs.UI")
local EndColorTag = ____UI.EndColorTag
____exports.EnemyDropChanceByRank = {15, 100, 35}
____exports.MinQuality = 1
____exports.MaxQuality = 5
____exports.HigherLevelDropChancePct = 5
____exports.QualityWeights = {
    {quality = 1, weight = 100},
    {quality = 2, weight = 20},
    {quality = 3, weight = 10},
    {quality = 4, weight = 5},
    {quality = 5, weight = 1}
}
function ____exports.GetDropQuality()
    return GetByWeightFromArray(
        ____exports.QualityWeights,
        function(el) return el.weight end
    ).quality
end
____exports.DropConfigs = {{type = 0, weight = 50}, {type = 1, weight = 10}}
function ____exports.GetDropType()
    return GetByWeightFromArray(
        ____exports.DropConfigs,
        function(e) return e.weight end
    ).type
end
____exports.Stimpacks = {{section = "mw_stimpack_25", quality = 1, weight = 150}, {section = "mw_stimpack_50", quality = 3, weight = 40}, {section = "mw_stimpack_75", quality = 5, weight = 10}}
function ____exports.GetStimpack()
    local stimpack = GetByWeightFromArray(
        ____exports.Stimpacks,
        function(e) return e.weight end
    )
    return {stimpack.section, stimpack.quality}
end
function ____exports.GetDropParticles(____type, quality)
    if ____type == 0 or ____type == 1 then
        if quality <= 2 then
            return "static\\effects\\net_base_green"
        end
        if quality <= 4 then
            return "static\\effects\\net_base_blue"
        end
        return "static\\effects\\net_base_red"
    end
    return "_samples_particles_\\holo_lines"
end
____exports.WeaponBonusParamType = WeaponBonusParamType or ({})
____exports.WeaponBonusParamType.Damage = "damage"
____exports.WeaponBonusParamType.Rpm = "rpm"
____exports.WeaponBonusParamType.MagSize = "mag_size"
____exports.WeaponBonusParamType.FireMode = "fire_mode"
____exports.WeaponBonusParamType.Dispersion = "dispersion"
____exports.WeaponBonusParamType.Recoil = "recoil"
____exports.WeaponBonusParamType.ReloadSpeed = "reload_speed"
____exports.WeaponBonusParamType.BulletSpeed = "bullet_speed"
____exports.WeaponBonusParamType.CritChance = "crit_chance"
____exports.ParamsForSelection = {
    ____exports.WeaponBonusParamType.Damage,
    ____exports.WeaponBonusParamType.Rpm,
    ____exports.WeaponBonusParamType.MagSize,
    ____exports.WeaponBonusParamType.Dispersion,
    ____exports.WeaponBonusParamType.Recoil,
    ____exports.WeaponBonusParamType.ReloadSpeed,
    ____exports.WeaponBonusParamType.CritChance
}
____exports.ParamsWithWeaponUpgradesSelection = {
    ____exports.WeaponBonusParamType.Rpm,
    ____exports.WeaponBonusParamType.Dispersion,
    ____exports.WeaponBonusParamType.Recoil,
    ____exports.WeaponBonusParamType.BulletSpeed,
    ____exports.WeaponBonusParamType.FireMode
}
local NegativeBonuses = {____exports.WeaponBonusParamType.Recoil}
local HasNoValue = {____exports.WeaponBonusParamType.FireMode}
____exports.PctBonuses = {
    ____exports.WeaponBonusParamType.Damage,
    ____exports.WeaponBonusParamType.Rpm,
    ____exports.WeaponBonusParamType.MagSize,
    ____exports.WeaponBonusParamType.Dispersion,
    ____exports.WeaponBonusParamType.Recoil,
    ____exports.WeaponBonusParamType.BulletSpeed,
    ____exports.WeaponBonusParamType.ReloadSpeed,
    ____exports.WeaponBonusParamType.CritChance
}
____exports.SectionFields = {
    damage = "_NotUsed",
    reload_speed = "_NotUsed",
    crit_chance = "_NotUsed",
    mag_size = "_NotUsed",
    rpm = "rpm",
    dispersion = "fire_dispersion_base",
    recoil = "cam_max_angle",
    bullet_speed = "bullet_speed",
    fire_mode = "fire_mode"
}
local BonusDescriptions = {
    damage = "Damage",
    rpm = "Fire Rate",
    mag_size = "Mag size",
    fire_mode = "AUTO fire mode enabled",
    dispersion = "Accuracy",
    recoil = "Recoil",
    reload_speed = "Reload speed",
    crit_chance = "Crit chance",
    bullet_speed = "Flatness"
}
function ____exports.GetBonusDescription(____type, bonus)
    if bonus == nil then
        bonus = 0
    end
    if __TS__ArrayIncludes(HasNoValue, ____type) then
        return ("%c[255,255,255,0]" .. BonusDescriptions[____type]) .. EndColorTag
    end
    local valueStr = ((__TS__ArrayIncludes(NegativeBonuses, ____type) and "-" or "+") .. tostring(math.floor(bonus))) .. (__TS__ArrayIncludes(____exports.PctBonuses, ____type) and "%" or "")
    return ((("%c[255,56,166,209]" .. __TS__StringPadEnd(valueStr, 6, " ")) .. EndColorTag) .. " ") .. BonusDescriptions[____type]
end
return ____exports
 end,
["MonsterWorldMod.GameObjects.MWMonster"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____BaseMWObject = require("MonsterWorldMod.GameObjects.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local constants = require("MonsterWorldMod.Configs.Constants")
local loot = require("MonsterWorldMod.Configs.Loot")
local ____Enemies = require("MonsterWorldMod.Configs.Enemies")
local MonsterConfigs = ____Enemies.MonsterConfigs
____exports.MWMonster = __TS__Class()
local MWMonster = ____exports.MWMonster
MWMonster.name = "MWMonster"
__TS__ClassExtends(MWMonster, BaseMWObject)
function MWMonster.prototype.____constructor(self, id)
    BaseMWObject.prototype.____constructor(self, id)
    self.id = id
end
__TS__SetDescriptor(
    MWMonster.prototype,
    "Name",
    {get = function(self)
        local nameInfo = (self.Type .. " L.") .. tostring(self.Level)
        if self.Rank == 2 then
            nameInfo = "[Boss] " .. nameInfo
        elseif self.Rank == 1 then
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
        return loot.EnemyDropChanceByRank[self.Rank + 1]
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
function MWMonster.prototype.OnFirstTimeInitialize(self)
    local spawnConfig = self:Load("SpawnParams")
    self.Type = spawnConfig.type
    self.Level = spawnConfig.level
    self.Rank = spawnConfig.rank
    local monsterCfg = MonsterConfigs[self.Type]
    local enemyHP = self:GetMaxHP(self.Level) * (monsterCfg.hp_mult or 1) * constants.EnemyHpMultsByRank[self.Rank + 1]
    local xpReward = self:GetXPReward(self.Level) * (monsterCfg.xp_mult or 1) * constants.EnemyXpMultsByRank[self.Rank + 1]
    local enemyDamage = self:GetDamage(self.Level) * (monsterCfg.damage_mult or 1) * constants.EnemyDamageMultsByRank[self.Rank + 1]
    self:SetStatBase(2, enemyHP)
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
    local pctMult = 1 + constants.EnemyHPPctPerLevel / 100 * (level - 1)
    local expMult = math.pow(constants.EnemyHPExpPerLevel, level - 1)
    local deltaMult = 1 + math.random(-constants.EnemyHpDeltaPct, constants.EnemyHpDeltaPct) / 100
    return constants.EnemyHPBase * pctMult * expMult * deltaMult
end
function MWMonster.prototype.GetXPReward(self, level)
    local pctMult = 1 + constants.EnemyXpRewardPctPerLevel / 100 * (level - 1)
    local expMult = math.pow(constants.EnemyXpRewardExpPerLevel, level - 1)
    local xp = constants.EnemyXpRewardBase * pctMult * expMult
    return math.floor(xp)
end
function MWMonster.prototype.GetDamage(self, level)
    local pctMult = 1 + constants.EnemyDamagePctPerLevel * level / 100
    local expMult = math.pow(constants.EnemyDamageExpPerLevel, level - 1)
    return constants.EnemyDamageBase * pctMult * expMult
end
return ____exports
 end,
["MonsterWorldMod.Helpers.Random"] = function(...) 
local ____exports = {}
function ____exports.IsPctRolled(value)
    return math.random(1, 100) <= value
end
return ____exports
 end,
["MonsterWorldMod.GameObjects.MWWeapon"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__StringReplace = ____lualib.__TS__StringReplace
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local ____BaseMWObject = require("MonsterWorldMod.GameObjects.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local cfg = require("MonsterWorldMod.Configs.Constants")
local ____Loot = require("MonsterWorldMod.Configs.Loot")
local MinQuality = ____Loot.MinQuality
local MaxQuality = ____Loot.MaxQuality
local WeaponBonusParamType = ____Loot.WeaponBonusParamType
local ParamsWithWeaponUpgradesSelection = ____Loot.ParamsWithWeaponUpgradesSelection
local GetBonusDescription = ____Loot.GetBonusDescription
local ParamsForSelection = ____Loot.ParamsForSelection
local PctBonuses = ____Loot.PctBonuses
local SectionFields = ____Loot.SectionFields
local ____Collections = require("MonsterWorldMod.Helpers.Collections")
local TakeRandomUniqueElementsFromArray = ____Collections.TakeRandomUniqueElementsFromArray
local ____Random = require("MonsterWorldMod.Helpers.Random")
local IsPctRolled = ____Random.IsPctRolled
____exports.MWWeapon = __TS__Class()
local MWWeapon = ____exports.MWWeapon
MWWeapon.name = "MWWeapon"
__TS__ClassExtends(MWWeapon, BaseMWObject)
function MWWeapon.prototype.____constructor(self, id)
    BaseMWObject.prototype.____constructor(self, id)
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
    {get = function(self)
        return self:GetStat(4)
    end},
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "MagSize",
    {get = function(self)
        return math.floor(self:GetStat(10))
    end},
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "FireDistance",
    {get = function(self)
        local ____table_GO_cast_Weapon_result_GetFireDistance_result_0 = self.GO
        if ____table_GO_cast_Weapon_result_GetFireDistance_result_0 ~= nil then
            ____table_GO_cast_Weapon_result_GetFireDistance_result_0 = ____table_GO_cast_Weapon_result_GetFireDistance_result_0:cast_Weapon():GetFireDistance()
        end
        return ____table_GO_cast_Weapon_result_GetFireDistance_result_0 or 1
    end},
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "DescriptionBonuses",
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
__TS__SetDescriptor(
    MWWeapon.prototype,
    "TimeBetweenShots",
    {get = function(self)
        local ____math_max_6 = math.max
        local ____table_GO_cast_Weapon_result_4 = self.GO
        if ____table_GO_cast_Weapon_result_4 ~= nil then
            ____table_GO_cast_Weapon_result_4 = ____table_GO_cast_Weapon_result_4:cast_Weapon()
        end
        local ____table_GO_cast_Weapon_result_RPM_result_2 = ____table_GO_cast_Weapon_result_4
        if ____table_GO_cast_Weapon_result_RPM_result_2 ~= nil then
            ____table_GO_cast_Weapon_result_RPM_result_2 = ____table_GO_cast_Weapon_result_RPM_result_2:RPM()
        end
        return ____math_max_6(0.01, ____table_GO_cast_Weapon_result_RPM_result_2)
    end},
    true
)
__TS__SetDescriptor(
    MWWeapon.prototype,
    "DPS",
    {get = function(self)
        return self.DamagePerHit * (1 / self.TimeBetweenShots)
    end},
    true
)
function MWWeapon.prototype.OnFirstTimeInitialize(self)
    local spawnCfg = self:Load("SpawnParams", {level = 1, quality = 1})
    self.Level = spawnCfg.level
    self.Quality = math.max(
        MinQuality,
        math.min(MaxQuality, spawnCfg.quality)
    )
    self.DescriptionBonuses = {}
    if (string.find(self.Section, "knife", nil, true) or 0) - 1 >= 0 then
        self:SetStatBase(4, cfg.WeaponDPSBase)
        return
    end
    self:GenerateWeaponStats()
end
function MWWeapon.prototype.GetBonusDescription(self)
    local result = ""
    for ____, ____type in ipairs(ParamsForSelection) do
        local value = self.DescriptionBonuses[____type] or 0
        if value ~= 0 then
            result = result .. GetBonusDescription(____type, value) .. " \\n"
        end
    end
    return result
end
function MWWeapon.prototype.OnWeaponPickedUp(self)
    self:RefillMagazine()
    self.GO:set_condition(100)
end
function MWWeapon.prototype.OnReloadStart(self, anim_table)
    local mult = 1 + MonsterWorld:GetStat(5, self, MonsterWorld.Player) / 100
    Log("OnReloadStart. Bonus: x" .. tostring(mult))
    anim_table.anm_speed = anim_table.anm_speed * mult
end
function MWWeapon.prototype.OnReloadEnd(self)
    self:RefillMagazine()
end
function MWWeapon.prototype.GetUpgradesByType(self, ____type)
    if ini_sys:r_string_ex(self.Section, ____type .. "_upgrades", "") ~= "" then
        return ini_sys:r_list(self.Section, ____type .. "_upgrades", {})
    end
    return {}
end
function MWWeapon.prototype.GenerateWeaponStats(self)
    local baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, self.Level - 1)
    local fireRate = 60 / ini_sys:r_float_ex(self.Section, "rpm", 1)
    local damagePerHit = baseDPS * fireRate
    self:SetStatBase(4, damagePerHit)
    local magSize = ini_sys:r_float_ex(self.Section, "ammo_mag_size", 1)
    self:SetStatBase(10, magSize)
    local weaponUpgradesByBonusType = {}
    for ____, uType in ipairs(ParamsWithWeaponUpgradesSelection) do
        local upgrades = self:GetUpgradesByType(uType)
        if #upgrades ~= 0 then
            weaponUpgradesByBonusType[uType] = upgrades
        end
    end
    local availableBonuses = {}
    for ____, ____type in ipairs(ParamsForSelection) do
        if not __TS__ArrayIncludes(ParamsWithWeaponUpgradesSelection, ____type) or weaponUpgradesByBonusType[____type] ~= nil then
            availableBonuses[#availableBonuses + 1] = ____type
        end
    end
    local upgradeTypesToAdd = 1 + self.Quality + math.floor(self.Level / 5)
    local upgradeTypesToSelect = math.min(#availableBonuses, upgradeTypesToAdd)
    local selectedUpgradeTypes = TakeRandomUniqueElementsFromArray(availableBonuses, upgradeTypesToSelect)
    if not __TS__ArrayIncludes(selectedUpgradeTypes, WeaponBonusParamType.MagSize) then
        selectedUpgradeTypes[#selectedUpgradeTypes + 1] = WeaponBonusParamType.MagSize
    end
    if IsPctRolled(30) and weaponUpgradesByBonusType[WeaponBonusParamType.BulletSpeed] ~= nil then
        selectedUpgradeTypes[#selectedUpgradeTypes + 1] = WeaponBonusParamType.BulletSpeed
    end
    if IsPctRolled(30) and weaponUpgradesByBonusType[WeaponBonusParamType.FireMode] ~= nil then
        selectedUpgradeTypes[#selectedUpgradeTypes + 1] = WeaponBonusParamType.FireMode
    end
    local damageBonusPct = 0
    local allSelectedUpgrades = {}
    for ____, paramType in ipairs(selectedUpgradeTypes) do
        if paramType == WeaponBonusParamType.Damage then
            damageBonusPct = damageBonusPct + math.random(5 + 10 * (self.Quality - 1), (15 + 15 * (self.Quality - 1)) * self.Quality)
        elseif paramType == WeaponBonusParamType.ReloadSpeed then
            local reloadSpeedBonus = math.random(2 + 3 * (self.Quality - 1), (10 + 10 * (self.Quality - 1)) * self.Quality)
            self.DescriptionBonuses[WeaponBonusParamType.ReloadSpeed] = reloadSpeedBonus
            self:AddStatBonus(5, 0, reloadSpeedBonus, "generation")
        elseif paramType == WeaponBonusParamType.CritChance then
            local critChanceBonus = math.random(1, (0.5 + 0.4 * (self.Quality - 1)) * self.Quality)
            self.DescriptionBonuses[WeaponBonusParamType.CritChance] = critChanceBonus
            self:AddStatBonus(7, 0, critChanceBonus, "generation")
        elseif paramType == WeaponBonusParamType.MagSize then
            local magSizeBonus = math.random(3 + 5 * (self.Quality - 1), (20 + 20 * (self.Quality - 1)) * self.Quality)
            while magSize * magSizeBonus / 100 < 1 do
                magSizeBonus = magSizeBonus + 3
            end
            self.DescriptionBonuses[WeaponBonusParamType.MagSize] = magSizeBonus
            self:AddStatBonus(10, 1, magSizeBonus, "generation")
        elseif paramType == WeaponBonusParamType.FireMode then
            allSelectedUpgrades[#allSelectedUpgrades + 1] = weaponUpgradesByBonusType[paramType][1]
            self.DescriptionBonuses[WeaponBonusParamType.FireMode] = 1
        else
            local minUpgradesToSelect = 1 + 2 * (self.Quality - 1)
            local maxUpgradesToSelect = 4 * self.Quality
            local upgradesToSelect = math.random(minUpgradesToSelect, maxUpgradesToSelect)
            local upgrades = weaponUpgradesByBonusType[paramType]
            local bonusValue = 0
            do
                local i = 0
                while i < upgradesToSelect do
                    local upgrade = upgrades[i + 1]
                    allSelectedUpgrades[#allSelectedUpgrades + 1] = upgrade
                    bonusValue = bonusValue + ini_sys:r_float_ex(
                        __TS__StringReplace(upgrade, "mwu", "mwb"),
                        SectionFields[paramType],
                        0
                    )
                    i = i + 1
                end
            end
            if bonusValue ~= 0 then
                if __TS__ArrayIncludes(PctBonuses, paramType) then
                    local defaultValue = ini_sys:r_float_ex(self.Section, SectionFields[paramType], 1)
                    if defaultValue == 0 then
                        defaultValue = 1
                    end
                    bonusValue = bonusValue / defaultValue * 100
                end
                self.DescriptionBonuses[paramType] = math.abs(bonusValue)
            end
        end
    end
    damageBonusPct = damageBonusPct + cfg.WeaponDPSPctPerQuality * (self.Quality - 1)
    if damageBonusPct > 0 then
        self.DescriptionBonuses[WeaponBonusParamType.Damage] = damageBonusPct
        self:AddStatBonus(4, 1, damageBonusPct, "generation")
    end
    for ____, upgrade in ipairs(allSelectedUpgrades) do
        upgrade = __TS__StringReplace(upgrade, "mwu", "mwe")
        self.GO:install_upgrade(upgrade)
    end
    self:RefillMagazine()
end
function MWWeapon.prototype.RefillMagazine(self)
    local ____table_GO_cast_Weapon_result_SetAmmoElapsed_result_7 = self.GO
    if ____table_GO_cast_Weapon_result_SetAmmoElapsed_result_7 ~= nil then
        ____table_GO_cast_Weapon_result_SetAmmoElapsed_result_7 = ____table_GO_cast_Weapon_result_SetAmmoElapsed_result_7:cast_Weapon():SetAmmoElapsed(self.MagSize)
    end
end
return ____exports
 end,
["MonsterWorldMod.Skills.SkillPassiveStatBonus"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Stats = require("MonsterWorldMod.Configs.Stats")
local StatTitles = ____Stats.StatTitles
local PctStats = ____Stats.PctStats
local ____Skill = require("MonsterWorldMod.Skills.Skill")
local Skill = ____Skill.Skill
____exports.SkillPassiveStatBonus = __TS__Class()
local SkillPassiveStatBonus = ____exports.SkillPassiveStatBonus
SkillPassiveStatBonus.name = "SkillPassiveStatBonus"
__TS__ClassExtends(SkillPassiveStatBonus, Skill)
function SkillPassiveStatBonus.prototype.____constructor(self, Id, Owner, Stat, BonusType, ValuePerLevel, PriceFormula, MaxLevel)
    if MaxLevel == nil then
        MaxLevel = -1
    end
    Skill.prototype.____constructor(
        self,
        Id,
        Owner,
        PriceFormula,
        MaxLevel
    )
    self.Id = Id
    self.Owner = Owner
    self.Stat = Stat
    self.BonusType = BonusType
    self.ValuePerLevel = ValuePerLevel
    self.PriceFormula = PriceFormula
    self.MaxLevel = MaxLevel
end
__TS__SetDescriptor(
    SkillPassiveStatBonus.prototype,
    "Description",
    {get = function(self)
        local value = self.Value
        local statTitle = StatTitles[self.Stat]
        if self.BonusType == 0 then
            return (((statTitle .. " ") .. (value > 0 and "+" or "")) .. tostring(value)) .. (__TS__ArrayIncludes(PctStats, self.Stat) and "%" or "")
        elseif self.BonusType == 1 then
            return (((statTitle .. " ") .. (value > 0 and "+" or "")) .. tostring(value)) .. "%"
        end
        return (statTitle .. " x") .. tostring(value)
    end},
    true
)
__TS__SetDescriptor(
    SkillPassiveStatBonus.prototype,
    "Value",
    {get = function(self)
        return self.ValuePerLevel(self.Level)
    end},
    true
)
function SkillPassiveStatBonus.prototype.UpdateLevelBonuses(self)
    Skill.prototype.UpdateLevelBonuses(self)
    self.Owner:AddStatBonus(self.Stat, self.BonusType, self.Value, self.Id)
end
return ____exports
 end,
["MonsterWorldMod.Skills.SkillAuraOfDeath"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Skill = require("MonsterWorldMod.Skills.Skill")
local Skill = ____Skill.Skill
____exports.SkillAuraOfDeath = __TS__Class()
local SkillAuraOfDeath = ____exports.SkillAuraOfDeath
SkillAuraOfDeath.name = "SkillAuraOfDeath"
__TS__ClassExtends(SkillAuraOfDeath, Skill)
function SkillAuraOfDeath.prototype.____constructor(self, Id, Owner, Interval, DpsPctPerLevel, RangePerLevel, PriceFormula, MaxLevel)
    if MaxLevel == nil then
        MaxLevel = -1
    end
    Skill.prototype.____constructor(
        self,
        Id,
        Owner,
        PriceFormula,
        MaxLevel
    )
    self.Id = Id
    self.Owner = Owner
    self.Interval = Interval
    self.DpsPctPerLevel = DpsPctPerLevel
    self.RangePerLevel = RangePerLevel
    self.PriceFormula = PriceFormula
    self.MaxLevel = MaxLevel
    self.timePassed = 0
end
__TS__SetDescriptor(
    SkillAuraOfDeath.prototype,
    "Description",
    {get = function(self)
        return ((((((("Every " .. tostring(self.Interval)) .. " ") .. (self.Interval == 1 and "second" or "seconds")) .. " damage all enemies in ") .. tostring(self.Range)) .. "m range for ") .. tostring(self.DpsPct)) .. "% of DPS"
    end},
    true
)
__TS__SetDescriptor(
    SkillAuraOfDeath.prototype,
    "Range",
    {get = function(self)
        return self.RangePerLevel(self.Level)
    end},
    true
)
__TS__SetDescriptor(
    SkillAuraOfDeath.prototype,
    "DpsPct",
    {get = function(self)
        return self.DpsPctPerLevel(self.Level)
    end},
    true
)
function SkillAuraOfDeath.prototype.Update(self, deltaTime)
    Skill.prototype.Update(self, deltaTime)
    self.timePassed = self.timePassed + deltaTime
    if self.timePassed < self.Interval then
        return
    end
    local weapon = MonsterWorld.Player.Weapon
    if weapon == nil then
        return
    end
    self.timePassed = self.timePassed - self.Interval
    local playerPos = MonsterWorld.Player.GO:position()
    local damage = weapon.DPS * self.DpsPct / 100
    for ____, monster in ipairs(MonsterWorld:GetMonstersInRange(playerPos, self.Range)) do
        MonsterWorld:DamageMonster(monster, damage, false)
    end
end
return ____exports
 end,
["MonsterWorldMod.Skills.SkillHealPlayerOnKill"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Skill = require("MonsterWorldMod.Skills.Skill")
local Skill = ____Skill.Skill
____exports.SkillHealPlayerOnKill = __TS__Class()
local SkillHealPlayerOnKill = ____exports.SkillHealPlayerOnKill
SkillHealPlayerOnKill.name = "SkillHealPlayerOnKill"
__TS__ClassExtends(SkillHealPlayerOnKill, Skill)
function SkillHealPlayerOnKill.prototype.____constructor(self, Id, Owner, HpPerLevel, PriceFormula, MaxLevel)
    if MaxLevel == nil then
        MaxLevel = -1
    end
    Skill.prototype.____constructor(
        self,
        Id,
        Owner,
        PriceFormula,
        MaxLevel
    )
    self.Id = Id
    self.Owner = Owner
    self.HpPerLevel = HpPerLevel
    self.PriceFormula = PriceFormula
    self.MaxLevel = MaxLevel
end
__TS__SetDescriptor(
    SkillHealPlayerOnKill.prototype,
    "Description",
    {get = function(self)
        return ("+" .. tostring(self.HPOnKill)) .. " HP on kill"
    end},
    true
)
__TS__SetDescriptor(
    SkillHealPlayerOnKill.prototype,
    "HPOnKill",
    {get = function(self)
        return self.HpPerLevel(self.Level)
    end},
    true
)
function SkillHealPlayerOnKill.prototype.OnMonsterKill(self, monster, isCrit)
    local ____MonsterWorld_Player_0, ____HP_1 = MonsterWorld.Player, "HP"
    ____MonsterWorld_Player_0[____HP_1] = ____MonsterWorld_Player_0[____HP_1] + self.HPOnKill
end
return ____exports
 end,
["MonsterWorldMod.Skills.SkillCriticalDeath"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Skill = require("MonsterWorldMod.Skills.Skill")
local Skill = ____Skill.Skill
____exports.SkillCriticalDeath = __TS__Class()
local SkillCriticalDeath = ____exports.SkillCriticalDeath
SkillCriticalDeath.name = "SkillCriticalDeath"
__TS__ClassExtends(SkillCriticalDeath, Skill)
function SkillCriticalDeath.prototype.____constructor(self, Id, Owner, ChancePctPerLevel, HpPctPerLevel, RangePerLevel, PriceFormula, MaxLevel)
    if MaxLevel == nil then
        MaxLevel = -1
    end
    Skill.prototype.____constructor(
        self,
        Id,
        Owner,
        PriceFormula,
        MaxLevel
    )
    self.Id = Id
    self.Owner = Owner
    self.ChancePctPerLevel = ChancePctPerLevel
    self.HpPctPerLevel = HpPctPerLevel
    self.RangePerLevel = RangePerLevel
    self.PriceFormula = PriceFormula
    self.MaxLevel = MaxLevel
end
__TS__SetDescriptor(
    SkillCriticalDeath.prototype,
    "Description",
    {get = function(self)
        return ((((tostring(self.Chance) .. "% chance on critical kill for enemy to explode and damage all enemies in ") .. tostring(self.Range)) .. "m radius for ") .. tostring(self.HpPct)) .. "% of HP"
    end},
    true
)
__TS__SetDescriptor(
    SkillCriticalDeath.prototype,
    "Chance",
    {get = function(self)
        return self.ChancePctPerLevel(self.Level)
    end},
    true
)
__TS__SetDescriptor(
    SkillCriticalDeath.prototype,
    "HpPct",
    {get = function(self)
        return self.HpPctPerLevel(self.Level)
    end},
    true
)
__TS__SetDescriptor(
    SkillCriticalDeath.prototype,
    "Range",
    {get = function(self)
        return self.RangePerLevel(self.Level)
    end},
    true
)
function SkillCriticalDeath.prototype.OnMonsterKill(self, monster, isCrit)
    if not isCrit then
        return
    end
    local monsterPos = monster.GO:position()
    local damage = monster.MaxHP * self.HpPct / 100
    local hits = 0
    for ____, nearbyMonster in ipairs(MonsterWorld:GetMonstersInRange(monsterPos, self.Range)) do
        MonsterWorld:DamageMonster(nearbyMonster, damage, false)
        hits = hits + 1
    end
    if hits > 0 then
        local particles = particles_object("anomaly2\\body_tear_00")
        particles:play_at_pos(monsterPos)
    end
end
return ____exports
 end,
["MonsterWorldMod.GameObjects.MWPlayer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____BaseMWObject = require("MonsterWorldMod.GameObjects.BaseMWObject")
local BaseMWObject = ____BaseMWObject.BaseMWObject
local cfg = require("MonsterWorldMod.Configs.Constants")
local ____Skill = require("MonsterWorldMod.Skills.Skill")
local PriceFormulaConstant = ____Skill.PriceFormulaConstant
local ____SkillPassiveStatBonus = require("MonsterWorldMod.Skills.SkillPassiveStatBonus")
local SkillPassiveStatBonus = ____SkillPassiveStatBonus.SkillPassiveStatBonus
____exports.MWPlayer = __TS__Class()
local MWPlayer = ____exports.MWPlayer
MWPlayer.name = "MWPlayer"
__TS__ClassExtends(MWPlayer, BaseMWObject)
__TS__SetDescriptor(
    MWPlayer.prototype,
    "RequeiredXP",
    {get = function(self)
        local expMult = math.pow(cfg.PlayerXPExp, self.Level)
        local pctMult = 1 + cfg.PlayerXPPct * self.Level / 100
        local xp = cfg.PlayerXPForFirstLevel * expMult * pctMult
        return math.max(
            1,
            math.floor(xp)
        )
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
    "Weapon",
    {get = function(self)
        return MonsterWorld:GetWeapon(self.GO:active_item())
    end},
    true
)
__TS__SetDescriptor(
    MWPlayer.prototype,
    "SkillPoints",
    {
        get = function(self)
            return self:Load("SkillPoints", 0)
        end,
        set = function(self, points)
            self:Save("SkillPoints", points)
        end
    },
    true
)
function MWPlayer.prototype.OnFirstTimeInitialize(self)
    self.Level = 0
    self.CurrentXP = 0
    self:SetStatBase(2, cfg.PlayerHPBase)
    self:SetStatBase(0, 1)
    self:SetStatBase(1, 1)
    self:SetStatBase(3, cfg.PlayerHPRegenBase)
    self:SetStatBase(6, 0)
    self:AddStatBonus(6, 0, cfg.PlayerDefaultCritDamagePct, "initial")
end
function MWPlayer.prototype.LevelUp(self)
    self.Level = self.Level + 1
    self.SkillPoints = self.SkillPoints + cfg.SkillPointsPerLevelUp
    self:UpdateLevelBonuses()
    local ____MonsterWorld_UIManager_ShowLevelUpMessage_result_0 = MonsterWorld.UIManager
    if ____MonsterWorld_UIManager_ShowLevelUpMessage_result_0 ~= nil then
        ____MonsterWorld_UIManager_ShowLevelUpMessage_result_0 = ____MonsterWorld_UIManager_ShowLevelUpMessage_result_0:ShowLevelUpMessage(self.Level)
    end
end
function MWPlayer.prototype.OnInitialize(self)
    BaseMWObject.prototype.OnInitialize(self)
    self:UpdateLevelBonuses()
    self.GO:set_actor_max_weight(100000)
    self.GO:set_actor_max_walk_weight(100000)
end
function MWPlayer.prototype.Update(self, deltaTime)
    BaseMWObject.prototype.Update(self, deltaTime)
    self:IterateSkills(function(s) return s:Update(deltaTime) end)
end
function MWPlayer.prototype.UpdateLevelBonuses(self)
    self:AddStatBonus(2, 1, cfg.PlayerHPPerLevel * self.Level, "level_bonus")
    self:AddStatBonus(3, 1, cfg.PlayerHPRegenPctPerLevel * self.Level, "level_bonus")
    self:AddStatBonus(0, 1, cfg.PlayerRunSpeedPctPerLevel * self.Level, "level_bonus")
end
function MWPlayer.prototype.OnStatChanged(self, stat, total)
    BaseMWObject.prototype.OnStatChanged(self, stat, total)
    if stat == 0 then
        db.actor:set_actor_run_coef(cfg.PlayerRunSpeedCoeff * total)
        db.actor:set_actor_runback_coef(cfg.PlayerRunBackSpeedCoeff * total)
    elseif stat == 1 then
        db.actor:set_actor_sprint_koef(cfg.PlayerSprintSpeedCoeff * total)
    end
end
function MWPlayer.prototype.SetupSkills(self)
    BaseMWObject.prototype.SetupSkills(self)
    self:AddSkill(__TS__New(
        SkillPassiveStatBonus,
        "max_hp",
        self,
        2,
        1,
        function(level) return 5 * level end,
        PriceFormulaConstant(1),
        50
    ))
    self:AddSkill(__TS__New(
        SkillPassiveStatBonus,
        "hp_regen",
        self,
        3,
        1,
        function(level) return 10 * level end,
        PriceFormulaConstant(1),
        50
    ))
    self:AddSkill(__TS__New(
        SkillPassiveStatBonus,
        "run_speed",
        self,
        0,
        1,
        function(level) return 1 * level end,
        PriceFormulaConstant(1),
        50
    ))
    self:AddSkill(__TS__New(
        SkillPassiveStatBonus,
        "reload_speed",
        self,
        5,
        0,
        function(level) return 1 * level end,
        PriceFormulaConstant(1),
        50
    ))
    self:AddSkill(__TS__New(
        SkillPassiveStatBonus,
        "crit_damage",
        self,
        6,
        0,
        function(level) return 5 * level end,
        PriceFormulaConstant(1),
        50
    ))
end
return ____exports
 end,
["MonsterWorldMod.Managers.SpawnManager"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local ____Constants = require("MonsterWorldMod.Configs.Constants")
local EnemyEliteChance = ____Constants.EnemyEliteChance
local EnemyBossChance = ____Constants.EnemyBossChance
local EnemyHigherLevelChance = ____Constants.EnemyHigherLevelChance
local ____Enemies = require("MonsterWorldMod.Configs.Enemies")
local MonsterConfigs = ____Enemies.MonsterConfigs
local ____Levels = require("MonsterWorldMod.Configs.Levels")
local LocationConfigs = ____Levels.LocationConfigs
local ____Collections = require("MonsterWorldMod.Helpers.Collections")
local RandomFromArray = ____Collections.RandomFromArray
local ____Random = require("MonsterWorldMod.Helpers.Random")
local IsPctRolled = ____Random.IsPctRolled
local ____StalkerAPI = require("MonsterWorldMod.Helpers.StalkerAPI")
local Load = ____StalkerAPI.Load
local Save = ____StalkerAPI.Save
local NumberToCondList = ____StalkerAPI.NumberToCondList
____exports.SpawnManager = __TS__Class()
local SpawnManager = ____exports.SpawnManager
SpawnManager.name = "SpawnManager"
function SpawnManager.prototype.____constructor(self)
    self.safeSmarts = {}
    local oldSimSquadAddSquadMember = sim_squad_scripted.sim_squad_scripted.add_squad_member
    sim_squad_scripted.sim_squad_scripted.add_squad_member = function(obj, section, pos, lvid, gvid)
        return self:OnSimSquadAddMember(
            obj,
            section,
            pos,
            lvid,
            gvid,
            oldSimSquadAddSquadMember
        )
    end
end
function SpawnManager.prototype.Save(self, data)
    data.safeSmarts = self.safeSmarts
end
function SpawnManager.prototype.Load(self, data)
    self.safeSmarts = data.safeSmarts or ({})
end
function SpawnManager.prototype.FillStartPositions(self)
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
function SpawnManager.prototype.OnTryRespawn(self, smart)
    if not smart.is_on_actor_level then
        return false
    end
    if self.safeSmarts[smart.id] ~= nil then
        return false
    end
    local respawnInterval = 600
    local maxPopulation = 2
    if not Load(smart.id, "MW_Initialized", false) or smart.respawn_idle ~= respawnInterval or smart.max_population ~= maxPopulation then
        if Load(smart.id, "MW_Initialized", false) then
        end
        smart.respawn_idle = respawnInterval
        smart.max_population = maxPopulation
        local locationCfg = LocationConfigs[level.name()]
        if not locationCfg then
            return false
        end
        local selectedMonsters = {}
        for monsterType, monsterCfg in pairs(MonsterConfigs) do
            do
                if monsterCfg.level_start > locationCfg.level or (monsterCfg.level_end or 100) < locationCfg.level then
                    goto __continue17
                end
                if bit.band(monsterCfg.level_type, locationCfg.type) ~= locationCfg.type then
                    goto __continue17
                end
                selectedMonsters[#selectedMonsters + 1] = monsterType
            end
            ::__continue17::
        end
        Save(smart.id, "MW_MonsterTypes", selectedMonsters)
        smart.respawn_params = {spawn_section_1 = {
            num = NumberToCondList(math.random(1, 2)),
            squads = {"simulation_monster_world"}
        }}
        smart.already_spawned = {spawn_section_1 = {num = 0}}
        smart.faction = "monster"
        smart.respawn_radius = 125
        Save(smart.id, "MW_Initialized", true)
    end
    if #MonsterWorld.Monsters > 150 then
        return false
    end
    return true
end
function SpawnManager.prototype.OnSimSquadAddMember(self, obj, section, pos, lvid, gvid, defaultFunction)
    if section ~= "dog_normal_red" then
        Log("SPAWN PROBLEM Wrong section " .. section)
        return
    end
    if not obj.smart_id then
        Log("SPAWN PROBLEM  NO SMART!")
        return
    end
    local monsterTypes = Load(obj.smart_id, "MW_MonsterTypes")
    local monsterType = RandomFromArray(monsterTypes)
    local monsterCfg = MonsterConfigs[monsterType]
    if monsterCfg == nil then
        Log("SPAWN PROBLEM  NO monsterCfg! " .. monsterType)
    end
    local squadSize = math.random(monsterCfg.squad_size_min, monsterCfg.squad_size_max)
    local isBossSpawned = false
    local elitesSpawned = 0
    local locCfg = LocationConfigs[level.name()]
    local locLevel = locCfg.level or 1
    if locLevel < 5 then
        squadSize = squadSize * (0.5 + 0.1 * locLevel)
    end
    local playerLevel = MonsterWorld.Player.Level
    local enemyLvl = locLevel
    if locLevel < playerLevel then
        if locLevel <= 5 then
            enemyLvl = math.max(locLevel, playerLevel - 1)
        elseif locLevel <= 15 then
            enemyLvl = math.max(locLevel, playerLevel)
        elseif locCfg.type == 1 then
            enemyLvl = math.max(locLevel, playerLevel + 1)
        elseif locCfg.type == 2 then
            enemyLvl = math.max(locLevel, playerLevel + 3)
        elseif locCfg.type == 4 then
            enemyLvl = math.max(locLevel, playerLevel + 5)
        end
    end
    do
        local i = 0
        while i < squadSize do
            do
                local squadMemberLevel = enemyLvl
                if IsPctRolled(EnemyHigherLevelChance) then
                    squadMemberLevel = squadMemberLevel + 1
                end
                local rank = 0
                if not isBossSpawned and IsPctRolled(EnemyEliteChance) then
                    elitesSpawned = elitesSpawned + 1
                    rank = 1
                elseif not isBossSpawned and elitesSpawned == 0 and IsPctRolled(EnemyBossChance) then
                    isBossSpawned = true
                    rank = 2
                end
                local section = monsterCfg.common_section
                if rank == 1 then
                    section = monsterCfg.elite_section
                elseif rank == 2 then
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
                    goto __continue32
                end
                Save(monsterId, "MW_SpawnParams", {type = monsterType, level = squadMemberLevel, rank = rank})
                i = i + 1
            end
            ::__continue32::
        end
    end
end
return ____exports
 end,
["MonsterWorldMod.Managers.UIManager"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local ____UI = require("MonsterWorldMod.Configs.UI")
local QualityColors = ____UI.QualityColors
local MonsterRankColors = ____UI.MonsterRankColors
local Qualities = ____UI.Qualities
____exports.UIManager = __TS__Class()
local UIManager = ____exports.UIManager
UIManager.name = "UIManager"
function UIManager.prototype.____constructor(self)
    self.damageNumbers = {}
    self.xpRewardNumbers = {}
    self.levelUpShowTime = 0
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
    utils_ui.UICellItem.Update = function(s, obj)
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
        local weapon = MonsterWorld:GetWeapon(obj)
        if not weapon then
            return res
        end
        if not s.mwLevel then
            local xml = CScriptXmlInit()
            xml:ParseFile("ui_monster_world.xml")
            s.mwLevel = xml:InitStatic("item_additions:level_text", s.cell)
            s.mwLevel:TextControl():SetFont(GetFontLetterica16Russian())
        end
        s.mwLevel:SetWndPos(vector2():set(
            3,
            s.cell:GetHeight() - 14
        ))
        s.mwLevel:TextControl():SetText((("L." .. tostring(weapon.Level)) .. "   DPS:") .. tostring(math.floor(weapon.DPS)))
        s.mwLevel:TextControl():SetTextColor(QualityColors[weapon.Quality])
        s.mwLevel:Show(true)
        return res
    end
    local oldUIInfoItemUpdate = utils_ui.UIInfoItem.Update
    utils_ui.UIInfoItem.Update = function(s, obj, sec, flags)
        oldUIInfoItemUpdate(s, obj, sec, flags)
        if not obj then
            return
        end
        local weapon = MonsterWorld:GetWeapon(obj)
        if not weapon then
            return
        end
        s.name:SetTextColor(QualityColors[weapon.Quality])
        s.ammo:Show(false)
        s.note:Show(false)
        s.value:Show(false)
        s.weight:Show(false)
    end
    local oldUISortBySizeKind = utils_ui.sort_by_sizekind
    utils_ui.sort_by_sizekind = function(t, a, b)
        local objA = t[a]
        local objB = t[b]
        local weaponA = MonsterWorld:GetWeapon(objA)
        local weaponB = MonsterWorld:GetWeapon(objB)
        if weaponA ~= nil and weaponB ~= nil and weaponA ~= weaponB then
            if weaponA.DPS ~= weaponB.DPS then
                return weaponA.DPS > weaponB.DPS
            elseif weaponA.Level ~= weaponB.Level then
                return weaponA.Level > weaponB.Level
            elseif weaponA.Quality ~= weaponB.Quality then
                return weaponA.Quality > weaponB.Quality
            else
                return weaponA.id > weaponB.id
            end
        end
        return oldUISortBySizeKind(t, a, b)
    end
    local oldUIInventoryInitControls = ui_inventory.UIInventory.InitControls
    ui_inventory.UIInventory.InitControls = function(s)
        self:OnInitInventoryControls(s)
        oldUIInventoryInitControls(s)
    end
end
function UIManager.prototype.Save(self, data)
end
function UIManager.prototype.Load(self, data)
end
function UIManager.prototype.Update(self)
    if not self:InitHud() then
        return
    end
    self:UpdateTarget()
    self:UpdateDamageNumbers()
    self:UpdateXpRewardNumbers()
    self:UpdatePlayerLevelBar()
    self:UpdateLevelUpMessage()
    self:UpdateSkills()
end
function UIManager.prototype.ShowLevelUpMessage(self, newLevel)
    self.levelUpShowTime = time_global()
    self.levelUpText:Show(true)
    self.levelUpText:SetText("LEVEL UP! NEW LEVEL: " .. tostring(newLevel))
end
function UIManager.prototype.ShowDamage(self, damage, isCrit, isKillHit)
    if isCrit == nil then
        isCrit = false
    end
    if isKillHit == nil then
        isKillHit = false
    end
    for ____, entry in ipairs(self.damageNumbers) do
        do
            if entry.text:IsShown() then
                goto __continue28
            end
            local msg = tostring(math.max(
                1,
                math.floor(damage)
            ))
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
            local ____temp_9
            if isCrit or isKillHit then
                ____temp_9 = GetFontGraffiti22Russian()
            else
                ____temp_9 = GetFontLetterica18Russian()
            end
            ____self_10_SetFont_11(____self_10, ____temp_9)
            entry.text:SetText(msg .. (isCrit and " X" or ""))
            entry.text:Show(true)
            return
        end
        ::__continue28::
    end
end
function UIManager.prototype.ShowXPReward(self, reward)
    for ____, entry in ipairs(self.xpRewardNumbers) do
        do
            if entry.text:IsShown() then
                goto __continue32
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
        ::__continue32::
    end
end
function UIManager.prototype.InitHud(self)
    if self.playerStatus ~= nil then
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
        Log("Initializing level_up")
        self.levelUpText = xml:InitTextWnd(
            "level_up",
            cs:wnd()
        )
        self.levelUpText:Show(false)
        Log("Initializing enemy_health")
        self.enemyHP = xml:InitStatic(
            "enemy_health",
            cs:wnd()
        )
        xml:InitStatic("enemy_health:background", self.enemyHP)
        self.enemyHP:Show(false)
        self.enemyHPBarProgress = xml:InitProgressBar("enemy_health:value_progress", self.enemyHP)
        self.enemyHPBarName = xml:InitTextWnd("enemy_health:name", self.enemyHP)
        self.enemyHPBarValue = xml:InitTextWnd("enemy_health:value", self.enemyHP)
        self.enemyHPOutOfDistanceNotice = xml:InitTextWnd("enemy_health:out_of_distance", self.enemyHP)
        self.enemyHPOutOfDistanceNotice:Show(false)
        Log("Initializing player status panel")
        self.playerStatus = xml:InitStatic(
            "player_status",
            cs:wnd()
        )
        self.playerStatus:Show(true)
        xml:InitStatic("player_status:background", self.playerStatus)
        self.playerStatusLevelValue = xml:InitTextWnd("player_status:level", self.playerStatus)
        self.playerStatusXPBar = xml:InitProgressBar("player_status:xpbar", self.playerStatus)
        self.playerStatusXPBarValue = xml:InitTextWnd("player_status:xpbar_value", self.playerStatus)
        self.playerStatusHPBar = xml:InitProgressBar("player_status:healthbar", self.playerStatus)
        self.playerStatusHPBarValue = xml:InitTextWnd("player_status:healthbar_value", self.playerStatus)
        return true
    end
    return false
end
function UIManager.prototype.UpdateTarget(self)
    local targetObj = level.get_target_obj()
    if not targetObj then
        self:HideEnemyHealthUI()
        return
    end
    local monster = MonsterWorld:GetMonster(targetObj)
    if monster and monster.HP > 0 and level.get_target_dist() < 300 then
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
function UIManager.prototype.HideEnemyHealthUI(self, force)
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
function UIManager.prototype.ShowEnemyHealthUI(self, monster)
    self.lastEnemyHpShowTime = time_global()
    self.enemyHP:Show(true)
    self.enemyHPBarProgress:SetProgressPos(clamp(monster.HP / monster.MaxHP, 0, 1) * 100)
    self.enemyHPBarName:SetText(monster.Name)
    self.enemyHPBarName:SetTextColor(MonsterRankColors[monster.Rank])
    self.enemyHPBarValue:SetText((tostring(math.floor(monster.HP)) .. " / ") .. tostring(math.floor(monster.MaxHP)))
    local player = MonsterWorld.Player
    local playerPos = player.GO:position()
    local ____player_Weapon_FireDistance_19 = player.Weapon
    if ____player_Weapon_FireDistance_19 ~= nil then
        ____player_Weapon_FireDistance_19 = ____player_Weapon_FireDistance_19.FireDistance
    end
    local distance = ____player_Weapon_FireDistance_19 or 100000
    self.enemyHPOutOfDistanceNotice:Show(monster.GO:position():distance_to(playerPos) >= distance)
end
function UIManager.prototype.UpdateDamageNumbers(self)
    local now = time_global()
    for ____, entry in ipairs(self.damageNumbers) do
        local text = entry.text
        if now - entry.showTime > 750 then
            text:Show(false)
        else
            local pos = text:GetWndPos()
            pos.y = pos.y - 2
            text:SetWndPos(pos)
        end
    end
end
function UIManager.prototype.UpdateXpRewardNumbers(self)
    local now = time_global()
    for ____, entry in ipairs(self.xpRewardNumbers) do
        local text = entry.text
        if now - entry.showTime > 1500 then
            text:Show(false)
        else
            local pos = text:GetWndPos()
            pos.y = pos.y - 1
            text:SetWndPos(pos)
        end
    end
end
function UIManager.prototype.UpdateLevelUpMessage(self)
    if time_global() - self.levelUpShowTime > 3000 then
        self.levelUpText:Show(false)
        return
    end
    local pos = self.levelUpText:GetWndPos()
    pos.y = pos.y - 0.35
    self.levelUpText:SetWndPos(pos)
end
function UIManager.prototype.UpdatePlayerLevelBar(self)
    local player = MonsterWorld.Player
    local levelInfo = "Level: " .. tostring(player.Level)
    if player.SkillPoints > 0 then
        levelInfo = levelInfo .. (" (SP: " .. tostring(player.SkillPoints)) .. ")"
    end
    self.playerStatusLevelValue:SetText(levelInfo)
    local currentXP = player.CurrentXP
    local reqXP = player.RequeiredXP
    self.playerStatusXPBarValue:SetText((tostring(math.floor(currentXP)) .. " / ") .. tostring(math.floor(reqXP)))
    self.playerStatusXPBar:SetProgressPos(clamp(currentXP / reqXP, 0, 1) * 100)
    local currentHP = player.IsDead and 0 or player.HP
    local maxHP = player.MaxHP
    self.playerStatusHPBarValue:SetText((tostring(math.floor(currentHP)) .. " / ") .. tostring(math.floor(maxHP)))
    self.playerStatusHPBar:SetProgressPos(clamp(currentHP / maxHP, 0, 1) * 100)
end
function UIManager.prototype.OnInitInventoryControls(self, s)
    local xml = CScriptXmlInit()
    xml:ParseFile("ui_monster_world.xml")
    self.playerSkills = xml:InitStatic("player_skills", s)
    self.playerSkills:Show(true)
    xml:InitStatic("player_skills:background", self.playerSkills)
    self.playerSkillsScrollView = xml:InitScrollView("player_skills:list", self.playerSkills)
    self.playerSkillTotalSP = xml:InitTextWnd("player_skills:total_sp", self.playerSkills)
    for ____, ____value in __TS__Iterator(MonsterWorld.Player.Skills) do
        local skillId = ____value[1]
        local skill = ____value[2]
        local skillEntry = xml:InitStatic("player_skills:skill", nil)
        xml:InitStatic("player_skills:skill:background_frame", skillEntry)
        xml:InitStatic("player_skills:skill:background", skillEntry)
        skill.DescriptionText = xml:InitTextWnd("player_skills:skill:info", skillEntry)
        skill.LevelText = xml:InitTextWnd("player_skills:skill:level", skillEntry)
        skill.UpgradeButton = xml:Init3tButton("player_skills:skill:upgrade_button", skillEntry)
        local actionId = "upgrade_" .. skillId
        s:Register(skill.UpgradeButton, actionId)
        local currentSkillId = skillId
        s:AddCallback(
            actionId,
            17,
            function(id) return self:OnSkillUpgrade(id) end,
            currentSkillId
        )
        skill:UpdateUI()
        self.playerSkillsScrollView:AddWindow(skillEntry, true)
        skillEntry:SetAutoDelete(true)
    end
end
function UIManager.prototype.OnSkillUpgrade(self, skillId)
    Log("On skill upgrade " .. skillId)
    local player = MonsterWorld.Player
    local skill = player.Skills:get(skillId)
    local ____skill_Upgrade_result_21 = skill
    if ____skill_Upgrade_result_21 ~= nil then
        ____skill_Upgrade_result_21 = ____skill_Upgrade_result_21:Upgrade()
    end
end
function UIManager.prototype.UpdateSkills(self)
    if not self.playerSkills or not self.playerSkills:IsShown() then
        return
    end
    self.playerSkillTotalSP:SetText("Available SP: " .. tostring(MonsterWorld.Player.SkillPoints))
    for ____, ____value in __TS__Iterator(MonsterWorld.Player.Skills) do
        local _ = ____value[1]
        local skill = ____value[2]
        skill:UpdateUpgradeButton()
    end
end
function UIManager.prototype.PrepareUIItemStatsTable(self, oldPrepareStatsTable)
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
    local fireDistance = {
        index = 13,
        name = "Distance",
        value_functor = function(obj, sec) return self:UIGetWeaponFireDistance(obj) end,
        typ = "float",
        icon_p = "",
        track = false,
        magnitude = 1,
        unit = "m",
        compare = false,
        sign = false,
        show_always = true
    }
    weaponStats.fire_distance = fireDistance
    weaponStats.accuracy.index = 100
    weaponStats.accuracy.icon_p = ""
    weaponStats.handling.index = 101
    weaponStats.handling.icon_p = ""
    return result
end
function UIManager.prototype.UIGetItemName(self, obj, current)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return ""
    end
    return (((Qualities[weapon.Quality] .. " ") .. current) .. " L.") .. tostring(weapon.Level)
end
function UIManager.prototype.UIGetItemDescription(self, obj, current)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return ""
    end
    return weapon:GetBonusDescription()
end
function UIManager.prototype.UIGetItemLevel(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return weapon.Level
end
function UIManager.prototype.UIGetWeaponDPS(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return weapon.DPS
end
function UIManager.prototype.UIGetWeaponDamagePerHit(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return weapon.DamagePerHit
end
function UIManager.prototype.UIGetWeaponRPM(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return 60 / weapon.TimeBetweenShots
end
function UIManager.prototype.UIGetWeaponAmmoMagSize(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return weapon.MagSize
end
function UIManager.prototype.UIGetWeaponFireDistance(self, obj)
    local weapon = MonsterWorld:GetWeapon(obj)
    if weapon == nil then
        return 0
    end
    return weapon.FireDistance
end
return ____exports
 end,
["MonsterWorldMod.Helpers.Difficulty"] = function(...) 
local ____exports = {}
function ____exports.GetDifficultyDamageMult()
    local ____math_max_2 = math.max
    local ____alife_storage_manager_get_state_result_diff_game_type_0 = alife_storage_manager.get_state()
    if ____alife_storage_manager_get_state_result_diff_game_type_0 ~= nil then
        ____alife_storage_manager_get_state_result_diff_game_type_0 = ____alife_storage_manager_get_state_result_diff_game_type_0.diff_game.type
    end
    return 1 + 0.5 * (____math_max_2(1, ____alife_storage_manager_get_state_result_diff_game_type_0 or 0) - 1)
end
function ____exports.GetDifficultyDropChanceMult()
    local ____math_max_5 = math.max
    local ____alife_storage_manager_get_state_result_diff_eco_type_3 = alife_storage_manager.get_state()
    if ____alife_storage_manager_get_state_result_diff_eco_type_3 ~= nil then
        ____alife_storage_manager_get_state_result_diff_eco_type_3 = ____alife_storage_manager_get_state_result_diff_eco_type_3.diff_eco.type
    end
    return 1 / ____math_max_5(1, ____alife_storage_manager_get_state_result_diff_eco_type_3 or 0)
end
return ____exports
 end,
["MonsterWorldMod.Managers.TimerManager"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
____exports.TimerManager = __TS__Class()
local TimerManager = ____exports.TimerManager
TimerManager.name = "TimerManager"
function TimerManager.prototype.____constructor(self)
    self.timers = __TS__New(Map)
end
function TimerManager.prototype.AddOneTime(self, id, delay, callback)
    self.timers:set(id, {
        Repeat = false,
        Delay = delay,
        Interval = 0,
        IntervalsLeft = 0,
        Callback = callback
    })
end
function TimerManager.prototype.AddInterval(self, id, interval, delay, callback, maxIntervals)
    if maxIntervals == nil then
        maxIntervals = -1
    end
    self.timers:set(id, {
        Repeat = true,
        Delay = delay,
        Interval = interval,
        IntervalsLeft = maxIntervals,
        Callback = callback
    })
end
function TimerManager.prototype.AddOnObjectSpawn(self, id, objectId, callback)
    self:AddInterval(
        id,
        0.05,
        0,
        function()
            local obj = level.object_by_id(objectId)
            if obj ~= nil then
                callback(obj)
                return ____exports.StopTimerSignal
            end
        end
    )
end
function TimerManager.prototype.Remove(self, id)
    self.timers:delete(id)
end
function TimerManager.prototype.Update(self, deltaTime)
    local timersToDelete = {}
    for ____, ____value in __TS__Iterator(self.timers) do
        local id = ____value[1]
        local timer = ____value[2]
        timer.Delay = timer.Delay - deltaTime
        if timer.Delay <= 0 then
            local result = timer:Callback()
            local doStop = result == ____exports.StopTimerSignal
            if not timer.Repeat or timer.IntervalsLeft == 0 or doStop then
                timersToDelete[#timersToDelete + 1] = id
            else
                timer.Delay = timer.Interval
                timer.IntervalsLeft = timer.IntervalsLeft - 1
            end
        end
    end
    for ____, id in ipairs(timersToDelete) do
        self:Remove(id)
    end
end
____exports.StopTimerSignal = -1
return ____exports
 end,
["MonsterWorldMod.World"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__StringEndsWith = ____lualib.__TS__StringEndsWith
local Map = ____lualib.Map
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local Log = ____StalkerModBase.Log
local constants = require("MonsterWorldMod.Configs.Constants")
local ____MWMonster = require("MonsterWorldMod.GameObjects.MWMonster")
local MWMonster = ____MWMonster.MWMonster
local ____MWPlayer = require("MonsterWorldMod.GameObjects.MWPlayer")
local MWPlayer = ____MWPlayer.MWPlayer
local ____MWWeapon = require("MonsterWorldMod.GameObjects.MWWeapon")
local MWWeapon = ____MWWeapon.MWWeapon
local ____SpawnManager = require("MonsterWorldMod.Managers.SpawnManager")
local SpawnManager = ____SpawnManager.SpawnManager
local ____UIManager = require("MonsterWorldMod.Managers.UIManager")
local UIManager = ____UIManager.UIManager
local ____Difficulty = require("MonsterWorldMod.Helpers.Difficulty")
local GetDifficultyDamageMult = ____Difficulty.GetDifficultyDamageMult
local GetDifficultyDropChanceMult = ____Difficulty.GetDifficultyDropChanceMult
local ____Loot = require("MonsterWorldMod.Configs.Loot")
local GetDropType = ____Loot.GetDropType
local HigherLevelDropChancePct = ____Loot.HigherLevelDropChancePct
local MaxQuality = ____Loot.MaxQuality
local GetDropQuality = ____Loot.GetDropQuality
local GetStimpack = ____Loot.GetStimpack
local GetDropParticles = ____Loot.GetDropParticles
local ____StalkerAPI = require("MonsterWorldMod.Helpers.StalkerAPI")
local GetId = ____StalkerAPI.GetId
local CreateVector = ____StalkerAPI.CreateVector
local CreateWorldPositionAtPosWithGO = ____StalkerAPI.CreateWorldPositionAtPosWithGO
local Save = ____StalkerAPI.Save
local ____Collections = require("MonsterWorldMod.Helpers.Collections")
local RandomFromArray = ____Collections.RandomFromArray
local ____Random = require("MonsterWorldMod.Helpers.Random")
local IsPctRolled = ____Random.IsPctRolled
local ____TimerManager = require("MonsterWorldMod.Managers.TimerManager")
local TimerManager = ____TimerManager.TimerManager
____exports.World = __TS__Class()
local World = ____exports.World
World.name = "World"
function World.prototype.____constructor(self, mod)
    self.mod = mod
    self.enemyDamageMult = 1
    self.enemyDropChanceMult = 1
    self.highlightParticles = {}
    MonsterWorld = self
    self.Monsters = {}
    self.weapons = {}
    self.SpawnManager = __TS__New(SpawnManager)
    self.UIManager = __TS__New(UIManager)
    self.Timers = __TS__New(TimerManager)
    bind_anomaly_field.bind_anomaly_field = function(_)
    end
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
    death_manager.create_release_item = function(_ignore)
    end
    death_manager.create_item_list = function(...)
    end
    local oldKeepItem = death_manager.keep_item
    death_manager.keep_item = function(npc, item)
        if not item then
            return
        end
        local item_id = item:id()
        local active_item = npc:active_item()
        oldKeepItem(npc, item)
        if active_item ~= nil and active_item:id() == item_id then
            npc:transfer_item(item, npc)
        end
    end
end
__TS__SetDescriptor(
    World.prototype,
    "Player",
    {get = function(self)
        if self.player == nil then
            self.player = __TS__New(MWPlayer, 0)
            self.player:Initialize()
        end
        return self.player
    end},
    true
)
function World.prototype.GetMonster(self, monster)
    local monsterId = GetId(monster)
    local se_obj = alife_object(monsterId)
    local go = level.object_by_id(monsterId)
    if se_obj == nil or go == nil or not (go:is_monster() or go:is_stalker()) then
        return nil
    end
    if not (self.Monsters[monsterId] ~= nil) then
        local monster = __TS__New(MWMonster, monsterId)
        monster:Initialize()
        self.Monsters[monsterId] = monster
    end
    return self.Monsters[monsterId]
end
function World.prototype.GetWeapon(self, item)
    local itemId = GetId(item)
    local se_obj = alife_object(itemId)
    local go = level.object_by_id(itemId)
    if se_obj == nil or go == nil or not go:is_weapon() then
        return nil
    end
    if not (self.weapons[itemId] ~= nil) then
        local weapon = __TS__New(MWWeapon, itemId)
        weapon:Initialize()
        self.weapons[itemId] = weapon
    end
    return self.weapons[itemId]
end
function World.prototype.DestroyObject(self, id)
    self:CleanupItemData(id)
    self.Monsters[id] = nil
    self.weapons[id] = nil
end
function World.prototype.OnTakeItem(self, item)
    local weapon = self:GetWeapon(item)
    local ____weapon_OnWeaponPickedUp_result_0 = weapon
    if ____weapon_OnWeaponPickedUp_result_0 ~= nil then
        ____weapon_OnWeaponPickedUp_result_0 = ____weapon_OnWeaponPickedUp_result_0:OnWeaponPickedUp()
    end
    self:CleanupItemData(item:id())
end
function World.prototype.CleanupItemData(self, id)
    self:RemoveTTLTimer(id)
    self:RemoveHighlight(id)
    level.map_remove_object_spot(id, "deadbody_location")
    level.map_remove_object_spot(id, "friend_location")
    level.map_remove_object_spot(id, "treasure")
end
function World.prototype.OnItemUse(self, item)
    if __TS__StringStartsWith(
        item:section(),
        "mw_stimpack_"
    ) then
        local healPct = ini_sys:r_float_ex(
            item:section(),
            "mw_heal_pct",
            25
        )
        local ____self_Player_2, ____HP_3 = self.Player, "HP"
        ____self_Player_2[____HP_3] = ____self_Player_2[____HP_3] + self.Player.MaxHP * healPct / 100
    end
end
function World.prototype.OnWeaponFired(self, wpn, ammo_elapsed)
    local weapon = self:GetWeapon(wpn)
    if weapon ~= nil and __TS__StringEndsWith(weapon.Section, "_mw") and weapon.GO:get_ammo_total() < 500 then
        local ammo = ini_sys:r_sec_ex(weapon.Section, "ammo_class")
        alife_create_item(ammo, self.Player.GO, {ammo = 1})
    end
end
function World.prototype.OnPlayerSpawned(self)
    self.enemyDamageMult = GetDifficultyDamageMult()
    self.enemyDropChanceMult = GetDifficultyDropChanceMult()
end
function World.prototype.Save(self, data)
    self.SpawnManager:Save(data)
    self.UIManager:Save(data)
end
function World.prototype.Load(self, data)
    self.SpawnManager:Load(data)
    self.UIManager:Load(data)
end
function World.prototype.Update(self, deltaTime)
    self.DeltaTime = deltaTime
    self.Timers:Update(deltaTime)
    self.UIManager:Update()
    self.Player:Update(deltaTime)
    self.Player:IterateSkills(function(s) return s:Update(deltaTime) end)
    for _, monster in pairs(self.Monsters) do
        monster:Update(deltaTime)
    end
end
function World.prototype.OnPlayerHit(self, shit, boneId)
    local attackerGO = shit.draftsman
    if not attackerGO:is_monster() and not attackerGO:is_stalker() then
        return
    end
    local monster = self:GetMonster(attackerGO)
    if monster == nil then
        return
    end
    local damage = monster.Damage
    if attackerGO:is_stalker() and shit.weapon_id ~= 0 and shit.weapon_id ~= attackerGO:id() then
        local weapon = level.object_by_id(shit.weapon_id)
        local ____weapon_is_weapon_result_4 = weapon
        if ____weapon_is_weapon_result_4 ~= nil then
            ____weapon_is_weapon_result_4 = ____weapon_is_weapon_result_4:is_weapon()
        end
        if ____weapon_is_weapon_result_4 then
            damage = damage * clamp(
                weapon:cast_Weapon():RPM(),
                0.25,
                1.25
            )
        end
    end
    damage = math.max(1, damage) * self.enemyDamageMult
    local ____self_Player_6, ____HP_7 = self.Player, "HP"
    ____self_Player_6[____HP_7] = ____self_Player_6[____HP_7] - damage
    Log((((((("Player was hit by " .. monster.Name) .. " for ") .. tostring(damage)) .. "(") .. tostring(monster.Damage)) .. ") in ") .. tostring(boneId))
end
function World.prototype.OnMonstersHit(self, monsterHitsThisFrame)
    Log("OnMonstersHit")
    local hitsByWeapon = __TS__New(Map)
    for ____, ____value in __TS__Iterator(monsterHitsThisFrame) do
        local _ = ____value[1]
        local hitInfo = ____value[2]
        local hits = hitsByWeapon:get(hitInfo.weapon) or ({})
        hits[#hits + 1] = {hitInfo.monster, hitInfo.isCritPartHit}
        hitsByWeapon:set(hitInfo.weapon, hits)
        Log((("OnMonstersHit. " .. tostring(#hits)) .. " with ") .. hitInfo.weapon.SectionId)
    end
    for ____, ____value in __TS__Iterator(hitsByWeapon) do
        local weapon = ____value[1]
        local hits = ____value[2]
        local isCritByWeapon = IsPctRolled(self:GetStat(7, weapon, self.Player))
        local weaponDamage = weapon.DamagePerHit / #hits
        for ____, ____value in ipairs(hits) do
            local monster = ____value[1]
            local isCritPartHit = ____value[2]
            do
                if monster.IsDead then
                    goto __continue44
                end
                local monsterDamage = weaponDamage
                if monster.GO:is_stalker() then
                    monsterDamage = monsterDamage * (1 + self:GetStat(8, weapon, self.Player) / 100)
                elseif monster.GO:is_monster() then
                    monsterDamage = monsterDamage * (1 + self:GetStat(9, weapon, self.Player) / 100)
                end
                local isCrit = isCritPartHit or isCritByWeapon
                if isCrit then
                    local critDamageMult = 1 + self:GetStat(6, weapon, self.Player) / 100
                    monsterDamage = monsterDamage * critDamageMult
                end
                local realDamage = self:DamageMonster(monster, monsterDamage, isCrit)
                self.UIManager:ShowDamage(realDamage, isCrit, monster.IsDead)
                self.Player:IterateSkills(function(s) return s:OnMonsterHit(monster, isCrit) end)
            end
            ::__continue44::
        end
    end
end
function World.prototype.DamageMonster(self, monster, damage, isCrit)
    local realDamage = math.min(monster.HP, damage)
    monster.HP = monster.HP - realDamage
    if monster.IsDead then
        self:OnMonsterKilled(monster, isCrit)
    end
    return realDamage
end
function World.prototype.GetStat(self, stat, ...)
    local sources = {...}
    local value = 0
    for ____, source in ipairs(sources) do
        value = value + source:GetStat(stat)
    end
    return value
end
function World.prototype.OnMonsterKilled(self, monster, isCrit)
    Log(((("OnMonsterKilled. " .. monster.Name) .. " (") .. monster.SectionId) .. ")")
    self.UIManager:ShowXPReward(monster.XPReward)
    local ____self_Player_8, ____CurrentXP_9 = self.Player, "CurrentXP"
    ____self_Player_8[____CurrentXP_9] = ____self_Player_8[____CurrentXP_9] + monster.XPReward
    local dropChance = monster.DropChance * self.enemyDropChanceMult
    if IsPctRolled(dropChance) then
        self:GenerateDrop(monster)
    end
    self.Player:IterateSkills(function(s) return s:OnMonsterKill(monster, isCrit) end)
    self:AddTTLTimer(monster.id, 3)
    Log(((("OnMonsterKilled END. " .. monster.Name) .. " (") .. monster.SectionId) .. ")")
end
function World.prototype.GenerateDrop(self, monster)
    Log("GenerateDrop")
    local ____type = GetDropType()
    local sgo = nil
    local quality = 1
    if ____type == 0 then
        sgo, quality = self:GenerateWeaponDropFromMonster(monster)
    elseif ____type == 1 then
        sgo, quality = self:GenerateStimpackDropFromMonster(monster)
    end
    if sgo ~= nil then
        Log((("Spawned " .. sgo:section_name()) .. ":") .. tostring(sgo.id))
        self:HighlightDroppedItem(sgo.id, ____type, quality)
        self:AddTTLTimer(sgo.id, 300)
    else
        Log("Drop generation failed")
    end
end
function World.prototype.GenerateWeaponDrop(self, dropLevel, qualityLevel, pos)
    local typedSections = ini_sys:r_list("mw_drops_by_weapon_type", "sections")
    local selectedTypeSection = RandomFromArray(typedSections)
    local weaponCount = ini_sys:line_count(selectedTypeSection)
    local selectedElement = math.random(0, weaponCount - 1)
    Log((((("Selecting base " .. tostring(selectedElement)) .. " from ") .. tostring(weaponCount)) .. " in ") .. tostring(selectedTypeSection))
    local _, weaponBaseSection = ini_sys:r_line_ex(selectedTypeSection, selectedElement)
    local weaponVariants = ini_sys:r_list(weaponBaseSection, "variants")
    local selectedVariant = RandomFromArray(weaponVariants)
    if IsPctRolled(HigherLevelDropChancePct) then
        dropLevel = dropLevel + 1
    end
    Log("Spawning " .. tostring(selectedVariant))
    local sgo = alife_create_item(selectedVariant, pos)
    if not sgo then
        Log("GenerateWeaponDrop spawn failed")
        return nil
    end
    qualityLevel = math.min(qualityLevel, MaxQuality)
    Save(sgo.id, "MW_SpawnParams", {level = dropLevel, quality = qualityLevel})
    return sgo
end
function World.prototype.GenerateWeaponDropFromMonster(self, monster)
    local dropLevel = monster.Level
    local qualityLevel = GetDropQuality()
    if IsPctRolled(constants.EnemyDropLevelIncreaseChanceByRank[monster.Rank + 1]) then
        dropLevel = dropLevel + 1
    end
    if IsPctRolled(constants.EnemyDropQualityIncreaseChanceByRank[monster.Rank + 1]) then
        qualityLevel = qualityLevel + 1
    end
    return self:GenerateWeaponDrop(
        dropLevel,
        qualityLevel,
        CreateWorldPositionAtPosWithGO(
            CreateVector(0, 0.2, 0),
            monster.GO
        )
    ), qualityLevel
end
function World.prototype.GenerateStimpackDrop(self, section, pos)
    local sgo = alife_create_item(section, pos)
    if not sgo then
        Log("GenerateStimpackDrop spawn failed")
        return nil
    end
    return sgo
end
function World.prototype.GenerateStimpackDropFromMonster(self, monster)
    local stimpackSection, quality = unpack(GetStimpack())
    Log("Spawning " .. stimpackSection)
    return self:GenerateStimpackDrop(
        stimpackSection,
        CreateWorldPositionAtPosWithGO(
            CreateVector(0, 0.2, 0),
            monster.GO
        )
    ), quality
end
function World.prototype.HighlightDroppedItem(self, id, ____type, quality)
    self.Timers:AddOnObjectSpawn(
        tostring(id) .. "_highlight",
        id,
        function(obj)
            local particles = particles_object(GetDropParticles(____type, quality))
            self.highlightParticles[id] = particles
            local pos = obj:position()
            pos.y = pos.y - 0.1
            particles:play_at_pos(pos)
            local spotType = "deadbody_location"
            if ____type == 1 then
                level.map_add_object_spot_ser(id, "friend_location", "")
            elseif ____type == 0 then
                if quality == 3 or quality == 4 then
                    spotType = "friend_location"
                end
                if quality == 5 then
                    spotType = "treasure"
                end
            end
            level.map_add_object_spot_ser(id, spotType, "")
        end
    )
end
function World.prototype.RemoveHighlight(self, id)
    self.Timers:Remove(tostring(id) .. "_highlight")
    local particles = self.highlightParticles[id]
    local ____particles_stop_result_10 = particles
    if ____particles_stop_result_10 ~= nil then
        ____particles_stop_result_10 = ____particles_stop_result_10:stop()
    end
    self.highlightParticles[id] = nil
end
function World.prototype.GetHighlighBone(self, go)
    local bone = "link"
    if go:is_weapon() then
        bone = "wpn_body"
    end
    return bone
end
function World.prototype.AddTTLTimer(self, id, time)
    self.Timers:AddOneTime(
        tostring(id) .. "_ttl",
        time,
        function()
            local toRelease = alife():object(id)
            if toRelease ~= nil then
                safe_release_manager.release(toRelease)
            end
        end
    )
end
function World.prototype.RemoveTTLTimer(self, id)
    self.Timers:Remove(tostring(id) .. "_ttl")
end
function World.prototype.GetMonstersInRange(self, pos, range)
    local result = {}
    local rangeSqr = range * range
    for _, monster in pairs(MonsterWorld.Monsters) do
        do
            if monster.GO == nil or monster.IsDead then
                goto __continue88
            end
            local distanceSqr = monster.GO:position():distance_to_sqr(pos)
            if distanceSqr <= rangeSqr then
                result[#result + 1] = monster
            end
        end
        ::__continue88::
    end
    return result
end
return ____exports
 end,
["MonsterWorldMod.Constants.WeaponAnimations"] = function(...) 
local ____exports = {}
____exports.ShowAnims = {
    "anm_show",
    "anm_show_0",
    "anm_show_1",
    "anm_show_2",
    "anm_show_empty",
    "anm_show_g",
    "anm_show_w_gl"
}
____exports.HideAnims = {
    "anm_hide",
    "anm_hide_0",
    "anm_hide_1",
    "anm_hide_2",
    "anm_hide_empty",
    "anm_hide_g",
    "anm_hide_w_gl"
}
____exports.ReloadAnims = {
    "anm_reload",
    "anm_reload_1",
    "anm_reload_2",
    "anm_reload_empty",
    "anm_add_cartridge",
    "anm_close",
    "anm_open",
    "anm_reload_g",
    "anm_reload_w_gl"
}
return ____exports
 end,
["MonsterWorldMod.Constants.CritBones"] = function(...) 
local ____exports = {}
local dogBones = {15}
local bloodsuckerBones = {14}
local humanBones = {
    14,
    15,
    16,
    17,
    18,
    19,
    2
}
____exports.CriticalBones = {
    Dog = dogBones,
    Boar = {20},
    Cat = {13},
    ["Pseudo Dog"] = dogBones,
    Bloodsucker = bloodsuckerBones,
    Fracture = {12, 13},
    Snork = {4, 5},
    Lurker = {23, 25, 26, 28},
    Flesh = {13},
    Chimera = {
        23,
        24,
        25,
        28,
        33
    },
    Burer = {
        39,
        40,
        41,
        42,
        44,
        45,
        47,
        48
    },
    Controller = {31},
    Psysucker = bloodsuckerBones,
    Giant = {1},
    Bandit = humanBones,
    Army = humanBones,
    Sin = humanBones,
    Mercenary = humanBones,
    Monolith = humanBones,
    Zombified = humanBones
}
return ____exports
 end,
["MonsterWorldMod.MonsterWorldMod"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local Map = ____lualib.Map
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local ____exports = {}
local ____StalkerModBase = require("StalkerModBase")
local StalkerModBase = ____StalkerModBase.StalkerModBase
local ____World = require("MonsterWorldMod.World")
local World = ____World.World
local ____WeaponAnimations = require("MonsterWorldMod.Constants.WeaponAnimations")
local ReloadAnims = ____WeaponAnimations.ReloadAnims
local ____Loot = require("MonsterWorldMod.Configs.Loot")
local GetStimpack = ____Loot.GetStimpack
local ____CritBones = require("MonsterWorldMod.Constants.CritBones")
local CriticalBones = ____CritBones.CriticalBones
local ____StalkerAPI = require("MonsterWorldMod.Helpers.StalkerAPI")
local CreateWorldPositionAtGO = ____StalkerAPI.CreateWorldPositionAtGO
____exports.MonsterWorldMod = __TS__Class()
local MonsterWorldMod = ____exports.MonsterWorldMod
MonsterWorldMod.name = "MonsterWorldMod"
__TS__ClassExtends(MonsterWorldMod, StalkerModBase)
function MonsterWorldMod.prototype.____constructor(self)
    StalkerModBase.prototype.____constructor(self)
    self.playerHitsThisFrame = {}
    self.monsterHitsThisFrame = __TS__New(Map)
    StalkerModBase.ModName = "MonsterWorldMod"
    StalkerModBase.IsLogEnabled = true
    self.World = __TS__New(World, self)
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
    StalkerModBase.prototype.OnMonsterNetSpawn(self, monster, serverObject)
    self.World:GetMonster(monster)
end
function MonsterWorldMod.prototype.OnNpcNetSpawn(self, npc, serverObject)
    StalkerModBase.prototype.OnNpcNetSpawn(self, npc, serverObject)
    self.World:GetMonster(npc)
end
function MonsterWorldMod.prototype.OnItemNetSpawn(self, item, serverObject)
    StalkerModBase.prototype.OnItemNetSpawn(self, item, serverObject)
end
function MonsterWorldMod.prototype.OnItemTake(self, item)
    StalkerModBase.prototype.OnItemTake(self, item)
    self.World:OnTakeItem(item)
end
function MonsterWorldMod.prototype.OnItemDrop(self, item)
    StalkerModBase.prototype.OnItemDrop(self, item)
    local se_obj = alife():object(item:id())
    if se_obj ~= nil then
        alife_release(se_obj)
    end
end
function MonsterWorldMod.prototype.OnItemUse(self, item)
    StalkerModBase.prototype.OnItemTake(self, item)
    self.World:OnItemUse(item)
end
function MonsterWorldMod.prototype.OnWeaponFired(self, obj, wpn, ammo_elapsed)
    StalkerModBase.prototype.OnWeaponFired(self, obj, wpn, ammo_elapsed)
    if obj:id() == 0 then
        self.World:OnWeaponFired(wpn, ammo_elapsed)
    end
end
function MonsterWorldMod.prototype.OnHudAnimationPlay(self, item, anim_table)
    StalkerModBase.prototype.OnHudAnimationPlay(self, item, anim_table)
    local weapon = self.World:GetWeapon(item)
    if weapon == nil then
        return
    end
    if __TS__ArrayIncludes(ReloadAnims, anim_table.anm_name) then
        weapon:OnReloadStart(anim_table)
    end
end
function MonsterWorldMod.prototype.OnHudAnimationEnd(self, item, section, motion, state, slot)
    StalkerModBase.prototype.OnHudAnimationEnd(
        self,
        item,
        section,
        motion,
        state,
        slot
    )
    local weapon = self.World:GetWeapon(item)
    if weapon == nil then
        return
    end
    if __TS__ArrayIncludes(ReloadAnims, motion) then
        weapon:OnReloadEnd()
    end
end
function MonsterWorldMod.prototype.OnBeforeKeyPress(self, key, bind, dis)
    if bind == key_bindings.kWPN_RELOAD then
        local weapon = self.World.Player.Weapon
        local ____weapon_GO_cast_Weapon_result_0 = weapon
        if ____weapon_GO_cast_Weapon_result_0 ~= nil then
            ____weapon_GO_cast_Weapon_result_0 = ____weapon_GO_cast_Weapon_result_0.GO:cast_Weapon()
        end
        local weaponGO = ____weapon_GO_cast_Weapon_result_0
        local ____temp_5 = weaponGO ~= nil
        if ____temp_5 then
            local ____temp_4 = weaponGO:GetAmmoElapsed()
            local ____weapon_MagSize_2 = weapon
            if ____weapon_MagSize_2 ~= nil then
                ____weapon_MagSize_2 = ____weapon_MagSize_2.MagSize
            end
            ____temp_5 = ____temp_4 < (____weapon_MagSize_2 or 1)
        end
        if ____temp_5 then
            weaponGO:SetAmmoElapsed(0)
            return true
        end
    end
    return StalkerModBase.prototype.OnBeforeKeyPress(self, key, bind, dis)
end
function MonsterWorldMod.prototype.OnNpcNetDestroy(self, npc)
    StalkerModBase.prototype.OnNpcNetDestroy(self, npc)
    self:OnMonsterNetDestroy(npc)
end
function MonsterWorldMod.prototype.OnMonsterNetDestroy(self, monster)
    StalkerModBase.prototype.OnMonsterNetDestroy(self, monster)
    local ____table_World_DestroyObject_result_6 = self.World
    if ____table_World_DestroyObject_result_6 ~= nil then
        ____table_World_DestroyObject_result_6 = ____table_World_DestroyObject_result_6:DestroyObject(monster:id())
    end
end
function MonsterWorldMod.prototype.OnServerEntityUnregister(self, serverObject, ____type)
    StalkerModBase.prototype.OnServerEntityUnregister(self, serverObject, ____type)
    local ____table_World_DestroyObject_result_8 = self.World
    if ____table_World_DestroyObject_result_8 ~= nil then
        ____table_World_DestroyObject_result_8 = ____table_World_DestroyObject_result_8:DestroyObject(serverObject.id)
    end
end
function MonsterWorldMod.prototype.OnActorFirstUpdate(self)
    StalkerModBase.prototype.OnActorFirstUpdate(self)
    self.World:OnPlayerSpawned()
end
function MonsterWorldMod.prototype.OnUpdate(self, deltaTime)
    StalkerModBase.prototype.OnUpdate(self, deltaTime)
    self.World:Update(deltaTime)
    if self.monsterHitsThisFrame.size > 0 then
        self.World:OnMonstersHit(self.monsterHitsThisFrame)
        self.monsterHitsThisFrame = __TS__New(Map)
    end
    self.playerHitsThisFrame = {}
end
function MonsterWorldMod.prototype.OnActorBeforeHit(self, shit, boneId)
    StalkerModBase.prototype.OnActorBeforeHit(self, shit, boneId)
    if not self:CanHitPlayer(shit.draftsman:id()) then
        return false
    end
    self.World:OnPlayerHit(shit, boneId)
    shit.power = 0
    shit.impulse = 0
    return true
end
function MonsterWorldMod.prototype.OnSimulationFillStartPosition(self)
    StalkerModBase.prototype.OnSimulationFillStartPosition(self)
    self.World.SpawnManager:FillStartPositions()
end
function MonsterWorldMod.prototype.OnSmartTerrainTryRespawn(self, smart)
    StalkerModBase.prototype.OnSmartTerrainTryRespawn(self, smart)
    return self.World.SpawnManager:OnTryRespawn(smart)
end
function MonsterWorldMod.prototype.OnMonsterBeforeHit(self, monsterGO, shit, boneId)
    StalkerModBase.prototype.OnMonsterBeforeHit(self, monsterGO, shit, boneId)
    if monsterGO.health <= 0 or shit.draftsman:id() ~= 0 then
        return false
    end
    local monster = self.World:GetMonster(monsterGO)
    if monster == nil then
        return false
    end
    local weapon = self.World:GetWeapon(shit.weapon_id)
    if weapon == nil then
        return false
    end
    local isCritPartHit = __TS__ArrayIncludes(CriticalBones[monster.Type], boneId)
    local hitInfo = {monster = monster, weapon = weapon, isCritPartHit = isCritPartHit}
    local currentHitInfo = self.monsterHitsThisFrame:get(monster.id)
    if currentHitInfo ~= nil then
        if not hitInfo.isCritPartHit then
            hitInfo.isCritPartHit = currentHitInfo.isCritPartHit
        end
    end
    self.monsterHitsThisFrame:set(monster.id, hitInfo)
    shit.power = 0
    return true
end
function MonsterWorldMod.prototype.OnNPCBeforeHit(self, npc, shit, boneId)
    StalkerModBase.prototype.OnNPCBeforeHit(self, npc, shit, boneId)
    return self:OnMonsterBeforeHit(npc, shit, boneId)
end
function MonsterWorldMod.prototype.OnNPCDeath(self, npc, killer)
    StalkerModBase.prototype.OnNPCDeath(self, npc, killer)
    self:OnMonsterDeath(npc, killer)
end
function MonsterWorldMod.prototype.OnKeyRelease(self, key)
    StalkerModBase.prototype.OnKeyRelease(self, key)
    if key == DIK_keys.DIK_DELETE then
        local ____self_World_Player_10, ____SkillPoints_11 = self.World.Player, "SkillPoints"
        ____self_World_Player_10[____SkillPoints_11] = ____self_World_Player_10[____SkillPoints_11] + 1000
    end
    if key == DIK_keys.DIK_UP then
        self.World:GenerateWeaponDrop(
            math.random(1, 30),
            math.random(1, 5),
            CreateWorldPositionAtGO(db.actor)
        )
    end
    if key == DIK_keys.DIK_DOWN then
        self.World:GenerateStimpackDrop(
            GetStimpack()[1],
            CreateWorldPositionAtGO(db.actor)
        )
    end
end
function MonsterWorldMod.prototype.CanHitPlayer(self, attackerId)
    if self.playerHitsThisFrame[attackerId] ~= nil then
        return false
    end
    self.playerHitsThisFrame[attackerId] = true
    return true
end
function ____exports.StartMonsterWorld()
    ____exports.MOD = __TS__New(____exports.MonsterWorldMod)
end
return ____exports
 end,
["StalkerAPI.scripts.db.t"] = function(...) 
 end,
["StalkerAPI.types.cai.t"] = function(...) 
 end,
}
return require("MonsterWorldMod.MonsterWorldMod", ...)
