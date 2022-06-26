export default class extends Pages {
    title = "Page CGU | NyanScan"

    get raw() {
        return `
    <section class="ns-background-image-cgu">
        <div class="ns-scan-CGU">
            <div class="text-center"><h1 class="ns-fs-1">CGU</h1></div>
            <div><h2 class="ns-fs-2">Petit titre 1</h2></div>
            <div><p>Vivamus vel pretium diam. Vivamus ullamcorper augue magna, ac ultrices sapien pellentesque id. Nulla facilisi. Cras tincidunt molestie nisi fermentum fringilla. Sed nisi erat, ultrices convallis scelerisque eu, tempus ut turpis. Donec porttitor tristique bibendum. Cras vel arcu dictum lectus volutpat aliquet posuere quis massa. In a pellentesque ligula, ac suscipit dolor. Sed maximus diam vitae velit aliquam, non dignissim nulla laoreet. Nam imperdiet est ut lectus scelerisque efficitur. Phasellus sit amet egestas enim.Mauris sagittis ante sit amet interdum sollicitudin. Mauris suscipit, urna vitae egestas vulputate, eros ipsum elementum erat, non pulvinar nibh lectus nec nunc. Mauris sed turpis pharetra risus varius mollis. Nullam tincidunt fringilla tincidunt. Fusce semper commodo lacus in luctus. Proin gravida sapien vitae velit vestibulum pellentesque. Sed sed elit nisi. Sed vehicula purus massa, sed dignissim turpis scelerisque vitae. Phasellus in bibendum felis. In hac habitasse platea dictumst. Sed vestibulum nec libero sit amet vestibulum. Aliquam eleifend turpis ac sem pellentesque, id sodales turpis imperdiet. Donec accumsan ex a mi ullamcorper, ac dignissim sapien auctor. Vestibulum non odio elit.
            Phasellus posuere nunc nec quam maximus, venenatis lacinia elit semper. Sed volutpat eleifend ligula, in tincidunt nunc fringilla vitae. Suspendisse pharetra sagittis enim, tincidunt tempus ipsum fringilla consectetur. Pellentesque ac lectus elit. Donec ac lacus massa. Phasellus quis tempor dolor. Sed est dui, auctor lobortis metus id, fringilla mollis nisi. Mauris eu fringilla turpis. Integer quis sagittis nibh. Cras nec fermentum ligula.</p></div>
            <div><h2 class="ns-fs-2">Petit titre 2</h2></div>
            <div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget sollicitudin nibh, cursus rhoncus quam. Praesent sit amet tortor in mauris imperdiet tincidunt ut id augue. In hac habitasse platea dictumst. Etiam pharetra, dolor eu ornare faucibus, purus diam congue augue, at viverra diam augue a mi. Aenean hendrerit tellus ut erat commodo, auctor commodo felis finibus. Integer sed velit finibus purus porta placerat. Cras consectetur risus neque, et interdum turpis pulvinar at.Mauris sagittis ante sit amet interdum sollicitudin. Mauris suscipit, urna vitae egestas vulputate, eros ipsum elementum erat, non pulvinar nibh lectus nec nunc. Mauris sed turpis pharetra risus varius mollis. Nullam tincidunt fringilla tincidunt. Fusce semper commodo lacus in luctus. Proin gravida sapien vitae velit vestibulum pellentesque. Sed sed elit nisi. Sed vehicula purus massa, sed dignissim turpis scelerisque vitae. Phasellus in bibendum felis. In hac habitasse platea dictumst. Sed vestibulum nec libero sit amet vestibulum. Aliquam eleifend turpis ac sem pellentesque, id sodales turpis imperdiet. Donec accumsan ex a mi ullamcorper, ac dignissim sapien auctor. Vestibulum non odio elit.
            Phasellus posuere nunc nec quam maximus, venenatis lacinia elit semper. Sed volutpat eleifend ligula, in tincidunt nunc fringilla vitae. Suspendisse pharetra sagittis enim, tincidunt tempus ipsum fringilla consectetur. Pellentesque ac lectus elit. Donec ac lacus massa. Phasellus quis tempor dolor. Sed est dui, auctor lobortis metus id, fringilla mollis nisi. Mauris eu fringilla turpis. Integer quis sagittis nibh. Cras nec fermentum ligula.</p></div>
        </div>
    </section>
      `;
    }

    constructor(app) {
        super(app);
    }

}
