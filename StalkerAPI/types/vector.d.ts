/** @customConstructor vector */
declare class vector {
    x: number;
    y: number;
    z: number;

    constructor();
  
    set_length(length: number): vector;
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
    set(x: number, y: number, z: number): vector;
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
    // function lerp(const vector&, const vector&, number)
    distance_to(vec: vector): number;
    distance_to_sqr(vec: vector): number;
    // function mul(number)
    // function mul(const vector&)
    // function mul(const vector&, const vector&)
    // function mul(const vector&, number)
    setHP(h: number, p: number): vector;
    // function add(number)
    add(vec: vector): vector;
    // function add(const vector&, const vector&)
    // function add(const vector&, number)
}
