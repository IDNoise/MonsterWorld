/** @customConstructor vector */
declare class Vector {
    x: number;
    y: number;
    z: number;
  
    constructor();
  
    set_length(length: number): Vector;
    // function sub(number)
    // function sub(const vector&)
    // function sub(const vector&, const vector&)
    // function sub(const vector&, number)
    // function reflect(const vector&, const vector&)
    // function slide(const vector&, const vector&)
    // function average(const vector&)
    // function average(const vector&, const vector&)
    // function normalize_safe()
    // function normalize_safe(const vector&)
    // function normalize()
    // function normalize(const vector&)
    // function align()
    // function magnitude() const
    getP(): number;
    // function max(const vector&)
    // function max(const vector&, const vector&)
    // function distance_to_xz(const vector&) const
    // function invert()
    // function invert(const vector&)
    // function mad(const vector&, number)
    // function mad(const vector&, const vector&, number)
    // function mad(const vector&, const vector&)
    // function mad(const vector&, const vector&, const vector&)
    // function clamp(const vector&)
    // function clamp(const vector&, vector)
    // function inertion(const vector&, number)
    // function crossproduct(const vector&, const vector&)
    set(x: number, y: number, z: number): Vector;
    // function set(const vector&)
    // function abs(const vector&)
    // function div(number)
    // function div(const vector&)
    // function div(const vector&, const vector&)
    // function div(const vector&, number)
    // function dotproduct(const vector&) const
    getH(): number;
    // function min(const vector&)
    // function min(const vector&, const vector&)
    // function similar(const vector&, number) const
    // function distance_to(const vector&) const
    // function lerp(const vector&, const vector&, number)
    // function distance_to_sqr(const vector&) const
    // function mul(number)
    // function mul(const vector&)
    // function mul(const vector&, const vector&)
    // function mul(const vector&, number)
    setHP(h: number, p: number): Vector;
    // function add(number)
    // function add(const vector&)
    // function add(const vector&, const vector&)
    // function add(const vector&, number)
}
  
/** @customConstructor vector():set */
declare class Vector3 extends Vector{
    constructor(x : number, y: number, z: number);
}

/** @customConstructor vector():setHP */
declare class VectorHP extends Vector{
    constructor(h : number, p: number);
}