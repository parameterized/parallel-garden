void fragment() {
    FOut = Src(I);

    ivec2 sz = Src_size();
    int x = I.x;
    int l = (x - 1 + sz.x) % sz.x;
    int r = (x + 1) % sz.x;
    int y = I.y;
    int d = (y - 1 + sz.y) % sz.y;
    int u = (y + 1) % sz.y;

    #define S(u, v) (Src(ivec2(u, v)).x)
    float nhood = (
        S(l, y) + S(r, y) + S(x, u) + S(x, d)
        + S(l, u) + S(l, d) + S(r, u) + S(r, d)
    );
    float v = float(nhood < 3.5 && nhood > 1.5 && (FOut.x + nhood) > 2.5);
    FOut = vec4(v, 0, 0, 1);
}
