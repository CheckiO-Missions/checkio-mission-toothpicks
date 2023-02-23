requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function tooth_picks_visualization(tgt_node, data) {

            if (!data || !data.ext) {
                return
            }

            const input = data.in[0]

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                tooth: {
                    'stroke': '#000000',
                    'stroke-width': '1',
                },
            }

            /*----------------------------------------------*
             *
             * (func) toothpicks
             *
             *----------------------------------------------*/
            function toothpicks(step) {
                const points = {}
                const lines = []
                let next_points = [[0, 0]]
                let tooth = 0
                let [max_x, max_y] = [0, 0]
                for (let i = 0; i < step; i += 1) {
                    tooth += next_points.length
                    let new_points = []
                    next_points.forEach(([nx, ny])=>{
                        let [np_1, np_2] = [[], []]
                        if (i % 2) {
                            [np_1, np_2] = [[nx-1, ny], [nx+1, ny]]
                            max_x = Math.max(max_x, nx+1)
                        } else {
                            [np_1, np_2] = [[nx, ny-1], [nx, ny+1]]
                            max_y = Math.max(max_y, ny+1)
                        }

                        if (!(np_1.toString() in points)) {
                            points[np_1.toString()] = 0
                        }
                        if (!(np_2.toString() in points)) {
                            points[np_2.toString()] = 0
                        }
                        points[np_1.toString()] += 1
                        points[np_2.toString()] += 1
                        lines.push([np_1, np_2])

                        new_points = new_points.concat([np_1, np_2])
                    })
                    next_points = []
                    new_points.forEach(np=>{
                        if (points[np.toString()] < 2) {
                            next_points.push(np)
                        }
                    })
                }
                return [lines, Math.max(max_x, max_y)]
            }

            /*----------------------------------------------*
             *
             * values
             *
             *----------------------------------------------*/
            const grid_size_px = 200
            const os = 15
            const [lines, max_coord] = toothpicks(input)
            const unit = grid_size_px / (max_coord*2)

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const paper = Raphael(tgt_node, grid_size_px + os*2, grid_size_px + +os*2, 0, 0)

            /*----------------------------------------------*
             *
             * draw tooth
             *
             *----------------------------------------------*/
            lines.forEach(([c1, c2])=>{
                const [x1, y1] = c1
                const [x2, y2] = c2
                paper.path(['M', x1*unit+100+os, y1*unit+100+os, 'L', x2*unit+100+os, y2*unit+100+os]
                ).attr(attr.tooth)
            })
        }

        var io = new extIO({
            animation: function($expl, data){
                tooth_picks_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
