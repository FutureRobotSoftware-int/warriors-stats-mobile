<template>
    <aside>
        <div>
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                <legend class="fieldset-legend">Filters</legend>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">AREA</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Left Corner
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Left Wing
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Top
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Right Wing
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Right Corner
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">PLAYER DIRECTION</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Left
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Right
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">PASS DIRECTION</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Left
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Right
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">OFF DRIBBLE HAND</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Left
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Right
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">OFFENSIVE ACTION</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                DHO
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Lift
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">HOP 1/2</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Hop
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                1/2 Left
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                1/2 Right
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">DEFENDER DISTANCE</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Close
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Open
                            </label>
                        </div>
                    </div>
                </div>
                <div class="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div class="collapse-title font-semibold">MAKE/MISS</div>
                    <div class="collapse-content text-sm">
                        <div class="flex flex-col">
                            <label class="label mb-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Make
                            </label>
                            <label class="label my-1">
                                <input type="checkbox" :checked="true" class="toggle" />
                                Miss
                            </label>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </aside>
</template>